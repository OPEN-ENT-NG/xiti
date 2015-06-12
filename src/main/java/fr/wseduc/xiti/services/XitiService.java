package fr.wseduc.xiti.services;

import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonObject;

import fr.wseduc.webutils.Either;

public interface XitiService {

	public void getConfig(Handler<Either<String, JsonObject>> handler);

	public void upsertPlatform(JsonObject data, Handler<Either<String, JsonObject>> handler);
	public void upsertStructure(String structureId, int xitiId, Handler<Either<String, JsonObject>> handler);

}
