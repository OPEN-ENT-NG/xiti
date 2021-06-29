/*
 * Copyright © "Open Digital Education" (SAS “WebServices pour l’Education”), 2014
 *
 * This program is published by "Open Digital Education" (SAS “WebServices pour l’Education”).
 * You must indicate the name of the software and the company in any production /contribution
 * using the software and indicate on the home page of the software industry in question,
 * "powered by Open Digital Education" with a reference to the website: https: //opendigitaleducation.com/.
 *
 * This program is free software, licensed under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, version 3 of the License.
 *
 * You can redistribute this application and/or modify it since you respect the terms of the GNU Affero General Public License.
 * If you modify the source code and then use this modified source code in your creation, you must make available the source code of your modifications.
 *
 * You should have received a copy of the GNU Affero General Public License along with the software.
 * If not, please see : <http://www.gnu.org/licenses/>. Full compliance requires reading the terms of this license and following its directives.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package fr.wseduc.xiti.events;

import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.webutils.Either;
import io.vertx.core.Vertx;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.mongodb.MongoDbResult;
import org.entcore.common.user.RepositoryEvents;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

public class XitiRepositoryEvents implements RepositoryEvents {

    protected static final Logger log = LoggerFactory.getLogger(XitiRepositoryEvents.class);
    protected final Vertx vertx;
    protected final MongoDb mongo;

    protected final String collection;

    public XitiRepositoryEvents(Vertx vertx, String collection) {
        this.vertx = vertx;
        this.mongo = MongoDb.getInstance();
        this.collection = collection;
    }

    @Override
    public void tenantsStructuresUpdated(JsonArray addedTenantsStructures, JsonArray deletedTenantsStructures) {
        JsonObject criteria = new JsonObject().put("config", true);
        JsonObject updates = new JsonObject();
        for (int i = 0; i < deletedTenantsStructures.size(); i++) {
            JsonArray structures = deletedTenantsStructures.getJsonObject(i).getJsonArray("structures");
            for (int j = 0; j < structures.size(); j++) {
                updates.put("structureMap." + structures.getString(j) + ".plateformeId", (String)null);
                updates.put("structureMap." + structures.getString(j) + ".projetId", (String)null);
            }
        }
        if (updates.isEmpty()) {
            return;
        }
        JsonObject data = new JsonObject().put("$set", updates);
        mongo.update(collection, criteria, data, true, false, MongoDbResult.validActionResultHandler(new Handler<Either<String, JsonObject>>() {
            @Override
            public void handle(Either<String, JsonObject> either) {
                if (either.isLeft()) {
                    log.error("Xiti : Could not proceed query: "+either.left().getValue());
                }
            }
        }));
    }


    @Override
    public void deleteGroups(JsonArray groups) {}

    @Override
    public void deleteUsers(JsonArray groups) {}

    @Override
    public void exportResources(JsonArray resourcesIds, boolean exportDocuments, boolean exportSharedResources, String exportId, String userId,
                                JsonArray groups, String exportPath, String locale, String host, Handler<Boolean> handler) {}

}
