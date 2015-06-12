package fr.wseduc.xiti.services.impl;

import org.entcore.common.mongodb.MongoDbResult;
import org.entcore.common.service.impl.MongoDbCrudService;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonObject;

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
		JsonObject criteria = new JsonObject().putBoolean("config", true);
		data.putBoolean("config", true);

		mongo.update(collection, criteria, data, true, false, MongoDbResult.validActionResultHandler(handler));
	}

	public void upsertStructure(String structureId, int xitiId, Handler<Either<String, JsonObject>> handler) {
		JsonObject criteria = new JsonObject().putBoolean("config", true);
		JsonObject data = new JsonObject()
			.putObject("$set", new JsonObject()
				.putNumber("structureMap."+structureId, xitiId));

		mongo.update(collection, criteria, data, true, false, MongoDbResult.validActionResultHandler(handler));
	}

	public void getConfig(Handler<Either<String, JsonObject>> handler) {
		JsonObject criteria = new JsonObject().putBoolean("config", true);

		mongo.findOne(collection, criteria, MongoDbResult.validResultHandler(handler));
	}

}
