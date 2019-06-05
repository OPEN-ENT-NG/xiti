/*
 * Copyright © Région Nord Pas de Calais-Picardie, Département 91, Région Aquitaine-Limousin-Poitou-Charentes, 2016.
 *
 * This file is part of OPEN ENT NG. OPEN ENT NG is a versatile ENT Project based on the JVM and ENT Core Project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation (version 3 of the License).
 *
 * For the sake of explanation, any module that communicate over native
 * Web protocols, such as HTTP, with OPEN ENT NG is outside the scope of this
 * license and could be license under its own terms. This is merely considered
 * normal use of OPEN ENT NG, and does not fall under the heading of "covered work".
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package fr.wseduc.xiti.services.impl;

import org.entcore.common.mongodb.MongoDbResult;
import org.entcore.common.service.impl.MongoDbCrudService;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.webutils.Either;
import fr.wseduc.xiti.services.XitiService;

public class XitiServiceMongoImpl extends MongoDbCrudService implements XitiService {

	private final String collection;
	private final MongoDb mongo;

	public XitiServiceMongoImpl(String collection) {
		super(collection);
		this.collection = collection;
		this.mongo = MongoDb.getInstance();
	}

	public void upsertPlatform(JsonObject data, Handler<Either<String, JsonObject>> handler){
		JsonObject criteria = new JsonObject().put("config", true);
		data.put("config", true);

		mongo.update(collection, criteria, data, true, false, MongoDbResult.validActionResultHandler(handler));
	}

	public void upsertStructure(String structureId, JsonObject structure, Handler<Either<String, JsonObject>> handler) {
		JsonObject criteria = new JsonObject().put("config", true);
		JsonObject data = new JsonObject()
			.put("$set", new JsonObject()
				.put("structureMap."+structureId, new JsonObject().put("id",structure.getLong("id"))
				.put("collectiviteId",structure.getLong("collectiviteId"))
				.put("plateformeId", structure.getLong("plateformeId"))
				.put("projetId", structure.getLong("projetId"))));

		mongo.update(collection, criteria, data, true, false, MongoDbResult.validActionResultHandler(handler));
	}

	public void upsertStructures(JsonArray array, Handler<Either<String, JsonObject>> handler){
		JsonObject criteria = new JsonObject().put("config", true);
		JsonObject input = new JsonObject();
		for(Object ob : array){
			JsonObject j = (JsonObject) ob;
			input.put("structureMap."+j.getString("structureId"),
					new JsonObject().put("id",j.getLong("id"))
					.put("collectiviteId",j.getLong("collectiviteId"))
					.put("plateformeId", j.getLong("plateformeId"))
					.put("projetId", j.getLong("projetId")));
		}
		mongo.update(collection, criteria, new JsonObject().put("$set", input), true, false, MongoDbResult.validActionResultHandler(handler));
	}

	public void getConfig(Handler<Either<String, JsonObject>> handler) {
		JsonObject criteria = new JsonObject().put("config", true);

		mongo.findOne(collection, criteria, MongoDbResult.validResultHandler(handler));
	}

}
