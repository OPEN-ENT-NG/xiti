import { model as Model, appPrefix } from 'entcore';
import http from "axios";

let windowAsAny = window as any;
if (!windowAsAny.xiti) windowAsAny.xiti = {};

declare var model: any;
declare var ATInternet: any;

let load = async function (): Promise<boolean> {

    if (Model) model = Model; // Trick to make it work in JS modules

    if (!windowAsAny.xiti.ATInternet) {
        let scriptPath = '/xiti/public/js/lib/smarttag_ENT.js';
        let response = await http.get(scriptPath);
        if (response.status != 200) return false;
        eval(response.data);
        windowAsAny.xiti.ATInternet = ATInternet;
    }

    let xitiConf;
    if (!windowAsAny.xiti.conf) {
        xitiConf = await http.get('/xiti/config');
        if (xitiConf.status != 200) return false;
        if (!xitiConf.data.structureMap) return false;
        windowAsAny.xiti.conf = xitiConf.data;
    }

    if (!windowAsAny.xiti.structure) {
        let structure;
        for (let struc of model.me.structures) {
            let s = windowAsAny.xiti.conf.structureMap[struc];
            if (s && s.collectiviteId && s.UAI) {
                structure = s;
                break;
            }
        }
        if (!structure || !structure.active) return false;
        windowAsAny.xiti.structure = structure;
    }

    return true;
}

let run = async function(locationPath = window.location.pathname) {
    console.log("Xiti directive");

    let loadDependancies = await load();
    if (!loadDependancies) return;

    let ATInternet = windowAsAny.xiti.ATInternet;
    let xitiConf = windowAsAny.xiti.conf;
    let structure = windowAsAny.xiti.structure;

    let appConf = await http.get(`/${appPrefix}/conf/public`);
    if (appConf.status != 200) return;
    let appXitiConf = appConf.data.xiti;
    if (!appXitiConf) return;

    // LIBELLE_SERVICE
    if (!appXitiConf.LIBELLE_SERVICE) return;
    let SERVICE = appXitiConf.LIBELLE_SERVICE.default || null;
    for(let prop in appXitiConf.LIBELLE_SERVICE){
        if(prop !== 'default' && locationPath.indexOf(prop) >= 0){
            SERVICE = appXitiConf.LIBELLE_SERVICE[prop];
            break;
        }
    }

    // TYPE & OUTIL
    let TYPE = 'NATIF', OUTIL = "";
    if (appXitiConf.OUTIL) {
        OUTIL = appXitiConf.OUTIL;
        TYPE = 'TIERS';
    }

    // PROJET
    let PROJET = xitiConf.ID_PROJET;
    if (structure.projetId) PROJET = structure.projetId;

    // EXPLOITANT
    let EXPLOITANT = xitiConf.ID_EXPLOITANT;

    // PLATFORME
    let PLATFORME = xitiConf.ID_PLATEFORME;
    if (structure.plateformeId) PLATFORME = structure.plateformeId;

    let pseudonymization = function(stringId){
        let buffer = "";
        for(let i = 0; i < stringId.length; i++){
            buffer += stringId.charCodeAt(i);
        }
        return buffer;
    }

    // ID_PERSO
    const ID_PERSO = pseudonymization(model.me.userId);
    
    // PROFIL
    let profileMap = {
        "Student": "ELEVE",
        "Teacher": "ENSEIGNANT",
        "Relative": "PARENT",
        "Personnel": "ADMIN_VIE_SCOL_TECH",
        "Guest": "AUTRE"
    }

    let PROFILE = "AUTRE";
    if (model.me.profiles && model.me.profiles.length > 0) {
        PROFILE = profileMap[model.me.profiles[0]];
    }

    // NOM_PAGE
    const NOM_PAGE = appPrefix === 'userbook' ? 'directory' : appPrefix;

    // UAI
    const UAI = structure.UAI;

    let ATTag = new ATInternet.Tracker.Tag({site: structure.collectiviteId});

    ATTag.setProps({
        "SERVICE": SERVICE,
        "TYPE": TYPE,
        "OUTIL": OUTIL,
        "UAI": UAI,
        "PROJET": PROJET,
        "EXPLOITANT": EXPLOITANT,
        "PLATEFORME": PLATFORME,
        "PROFIL": PROFILE,
    }, true);

    ATTag.identifiedVisitor.set({
        id: ID_PERSO,
        category: PROFILE
    });

    ATTag.page.set({
        name: NOM_PAGE,
        chapter1: '',
        chapter2: '',
        chapter3: '',
        level2: UAI,
    });

    ATTag.dispatch();
}

windowAsAny.xiti.run = run;

let click = async function(name: string, element: Element) {

    console.log("xiti click !!!");

    let loadDependancies = await load();
    if (!loadDependancies) return;

    let ATInternet = windowAsAny.xiti.ATInternet;
    let structure = windowAsAny.xiti.structure;

    let casMapping;
    try {
        casMapping = await http.get(`/xiti/cas-infos?connector=${name}`);
    } catch (error) {
        return;
    }
    if (casMapping.status != 200) return;
    if (!casMapping.data.xitiService || !casMapping.data.xitiOutil) return;

    //SERVICE
    const SERVICE = casMapping.data.xitiService;

    //OUTIL
    const OUTIL = casMapping.data.xitiOutil;

    const props = {
        "SERVICE": SERVICE,
        "TYPE": "TIERS",
        "OUTIL": OUTIL,
    }

    // NAME
    const NAME = name;

    // TYPE
    const TYPE = "navigation";

    // UAI
    const UAI = structure.UAI;

    let ATTag = new ATInternet.Tracker.Tag({site: structure.collectiviteId});

    ATTag.setProps(props, false);

    ATTag.click.send({
        elem: element,
        name: NAME,
        type: TYPE,
        level2: UAI,
    }); 
}

windowAsAny.xiti.click = click;