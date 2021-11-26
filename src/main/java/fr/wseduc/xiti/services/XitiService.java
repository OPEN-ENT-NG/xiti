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

package fr.wseduc.xiti.services;

import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import org.entcore.common.user.UserInfos;

import fr.wseduc.webutils.Either;

public interface XitiService {

	public void getConfig(UserInfos user, Handler<Either<String, JsonObject>> handler);

	public void upsertPlatform(JsonObject data, Handler<Either<String, JsonObject>> handler);
	public void upsertStructure(String structureId, JsonObject structure, Handler<Either<String, JsonObject>> handler);
	public void upsertStructures(JsonArray data, Handler<Either<String, JsonObject>> handler);
	public void getCasInfos(String connector, Handler<Either<String, JsonObject>> handler);

}
