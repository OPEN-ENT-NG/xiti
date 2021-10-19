import { model, appPrefix } from 'entcore';
import { build as buildModel } from './model'
import http from "axios";

let windowAsAny = window as any;

declare var ATInternet: any;

let xiti = async function(locationPath = window.location.pathname) {
    console.log("Xiti directive");

    ///////////////////////////////////////////////////////////////
    // NEW IMPLEM
    let scriptPath = '/xiti/public/js/lib/smarttag_ENT.js';
    let response = await http.get(scriptPath);
    if (response.status != 200) return;
    eval(response.data);

    model.build = buildModel;
    model.build();

    let xitiConf = (model as any).conf;
    await xitiConf.get();

    let structure;
    for (let struc of model.me.structures) {
        let s = xitiConf.data.structureMap[struc];
        if (s && s.collectiviteId && s.id) {
            structure = s;
            break;
        }
    }
    if (!structure) return;

    let appConf = await http.get('/' + (appPrefix === 'userbook' ? 'directory' : appPrefix) + '/conf/public');
    if (appConf.status != 200) return;
    let appXitiConf = appConf.data.xiti;

    if (!appXitiConf.LIBELLE_SERVICE) return;
    let SERVICE = appXitiConf.LIBELLE_SERVICE.default || null;
    for(let prop in appXitiConf.LIBELLE_SERVICE){
        if(prop !== 'default' && locationPath.indexOf(prop) >= 0){
            SERVICE = appXitiConf.LIBELLE_SERVICE[prop];
            break;
        }
    }

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
    
    let profile = "";
    if (model.me.profiles && model.me.profiles.length > 0) {
        profile = profileMap[model.me.profiles[0]];
    }

    let ATTag = new ATInternet.Tracker.Tag({site: structure.collectiviteId});

    ATTag.setProps({
        "SERVICE": SERVICE,
        "TYPE":"NATIF",
        "OUTIL":"OUTIL",
        "UAI":"UAI",
        "PROJET":"PROJET",
        "EXPLOITANT":"EXPLOITANT",
        "PLATEFORME":"PLATEFORME",
        "PROFIL":"PROFIL ",
    }, true);

    ATTag.identifiedVisitor.set({
        id: ID_PERSO,
        category: profile
    });

    ATTag.page.set({
        name:"NOM_PAGE",
        chapter1:'CHAP1',
        chapter2:'CHAP2',
        chapter3:'CHAP3',
        level2:"UAI",
    });

    //ATTag.dispatch();

    ///////////////////////////////////////////////////////////////
    // OLD IMPLEM

    /*
    //Xiti script path
    let scriptPath = skin.basePath + 'js/xtfirst_ENT.js';
    //let scriptPath = '/xiti/public/js/lib/smarttag_ENT.js';

	//Profile id map
    let profileMap = {
        "Student": 1,
        "Teacher": 2,
        "Relative": 3,
        "Personnel": 4
    }

    //Service map
    let serviceMap = {
        "": "Page_ENT",
        1:  "Stockage_Partage",
        2:  "Travail_Collaboratif",
        3:  "Notes",
        4:  "Absences",
        5:  "Services_Vie_Scolaire",
        6:  "Gestion_Competences",
        7:  "Gestion_Temps",
        9:  "Cahier_Textes",
        10: "Courrier_Electronique",
        11: "Actualites",
        12: "Reservation_Ressources",
        13: "Ressources_En_Ligne",
        15: "Documentation_CDI",
        16: "Orientation",
        17: "Parcours_Pedagogiques",
        18: "Services_Collectivites",
        19: "Visioconference"
    }

    let getOrElse = function(map, item, elseItem){
        if(map && item && map[item])
            return map[item];
        return elseItem;
    }

    let convertStringId = function(stringId){
        let buffer = "";
        for(let i = 0; i < stringId.length; i++){
            buffer += stringId.charCodeAt(i);
        }
        return buffer;
    }

    // CONF OBJECT //
    let xitiConf = {
        //Springboard constants
        ID_COLLECTIVITE: "",
        ID_PLATEFORME: "",
        ID_PROJET: "",

        //Structure let
        ID_ETAB : {
            id: null,
            collectiviteId: null
        },

        //App lets
        ID_SERVICE: null,
        LIB_SERVICE: "Page_ENT",

        //User lets
        ID_PERSO: convertStringId(model.me.userId),
        ID_PROFIL: 6,
        ENABLE_PROXY: false
    }

    //Retrieves structure mapping & platform dependant lets
    let getXitiConfig = async function(): Promise<boolean>{
        let response = await http.get('/xiti/config');
            let data = response.data;
            //If XiTi is disabled
            if(!data.active)
                return false;

            xitiConf.ID_COLLECTIVITE = data.ID_COLLECTIVITE;
            let struc = data.structureMap[model.me.structures[0]];
            xitiConf.ID_PLATEFORME = struc && struc.plateformeId ? struc.plateformeId : data.ID_PLATEFORME;
            xitiConf.ID_PROJET = struc && struc.projetId ? struc.projetId : data.ID_PROJET;

            xitiConf.ID_ETAB = struc || 0;
            return true;
    }

    //Retrieves user profile
    let getProfileInfos = async function(){
        if(model.me.profiles){
            xitiConf.ID_PROFIL = getOrElse(profileMap, model.me.profiles[0], 6);
        }
        else {
            let response = await http.get('/userbook/api/person');
            model.me.profiles = response.data.result['0'].type;
            xitiConf.ID_PROFIL = getOrElse(profileMap, model.me.profiles[0], 6);
        }
    }

    //Retrieves application dependent lets
    let getAppsInfos = function(){
        return async function(){

            //!\ Temporary Userbook workaround  /!\
            let inUserbook = locationPath.indexOf("/userbook") === 0;
            ////////////////////////////////////////

            // Eliot workaround //
            let inEliot = false;
            let eliotPrefix = windowAsAny.eliotPrefix;
            if(eliotPrefix !== "undefined"){
                inEliot = true;
            }

            let response = await http.get('/' + (inUserbook ? 'directory' : inEliot ? 'eliot' : appPrefix) + '/conf/public');
                let data = response.data;
                let currentLocation = inEliot ? '/eliot/'+eliotPrefix : locationPath;

                let serviceObj = getOrElse(data.xiti, 'ID_SERVICE', {});
                xitiConf.ID_SERVICE = getOrElse(serviceObj, 'default', null);
                xitiConf.ENABLE_PROXY = getOrElse(serviceObj, 'proxy', false);
                for(let prop in serviceObj){
                    if(prop !== 'default' && serviceObj.hasOwnProperty(prop) && currentLocation.indexOf(prop) >= 0){
                        xitiConf.ID_SERVICE = serviceObj[prop];
                        break;
                    }
                }

                xitiConf.ID_SERVICE = isNaN(xitiConf.ID_SERVICE) ? '' : xitiConf.ID_SERVICE;
                xitiConf.LIB_SERVICE = getOrElse(serviceMap, xitiConf.ID_SERVICE, "Page_ENT");

        }
    }

    //Final action - populates xiti lets & launches the script
    let loadScript = function(){
        windowAsAny.xt_multc = "&x1=" + xitiConf.ID_SERVICE +
            "&x2=" + xitiConf.ID_PROFIL +
            "&x3=" + xitiConf.ID_PROJET +
            "&x4=" + xitiConf.ID_PLATEFORME;

            windowAsAny.xt_at = xitiConf.ID_PERSO;
            windowAsAny.xtidc = xitiConf.ID_PERSO;
            windowAsAny.xt_ac = xitiConf.ID_PROFIL;

        windowAsAny.xtparam = windowAsAny.xt_multc + "&ac="+ windowAsAny.xt_ac  +"&at=" + windowAsAny.xt_at;

        windowAsAny.xtnv = document;
        if(xitiConf.ENABLE_PROXY == true){
            windowAsAny.xtsdi = windowAsAny.location.protocol + "//" + windowAsAny.location.host + "/hit.xitif";
        }
        windowAsAny.xtsd = windowAsAny.location.protocol === "https:" ? "https://logs" : "http://logi7";
        windowAsAny.xtsite = xitiConf.ID_ETAB.collectiviteId;
        windowAsAny.xtn2 = xitiConf.ID_ETAB.id;
        windowAsAny.xtpage = xitiConf.LIB_SERVICE;
        windowAsAny.xtdi = "";

        jQuery.getScript(scriptPath, function(){ console.log("xiti ready"); });
    }

    let isActive = await getXitiConfig();
    if (isActive) {
        await getProfileInfos();
        await getAppsInfos();
        await loadScript();
    }*/
}

windowAsAny.xiti = xiti;

xiti();