package fr.wseduc.xiti.controllers;

import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.http.response.DefaultResponseHandler;
import org.entcore.common.mongodb.MongoDbControllerHelper;
import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonObject;

import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.Either;
import fr.wseduc.webutils.http.Renders;
import fr.wseduc.webutils.request.RequestUtils;
import fr.wseduc.xiti.filters.XitiFilter;
import fr.wseduc.xiti.services.XitiService;
import fr.wseduc.xiti.services.impl.XitiServiceMongoImpl;

public class XitiController extends MongoDbControllerHelper {

	private XitiService service;

	public XitiController(String collection) {
		super(collection);
		this.service = new XitiServiceMongoImpl(collection);
	}

	@Get("/config")
	@SecuredAction(type = ActionType.AUTHENTICATED, value = "")
	public void getConfig(final HttpServerRequest request){
		service.getConfig(new Handler<Either<String, JsonObject>>() {
			@Override
			public void handle(Either<String, JsonObject> event) {
				if (event.isRight()) {
					Renders.renderJson(request,
							event.right().getValue().putBoolean("active", container.config().getBoolean("active", false)), 200);
				} else {
					JsonObject error = new JsonObject()
							.putString("error", event.left().getValue());
					Renders.renderJson(request, error, 400);
				}
			}
		});
	}

	@Get("/admin-console")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	@ResourceFilter(XitiFilter.class)
	public void adminPage(final HttpServerRequest request){
		renderView(request);
	}

	@Put("/structure/:structureId/:xitiId")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	@ResourceFilter(XitiFilter.class)
	public void setupApplication(final HttpServerRequest request){
		try{
			final String structureId = request.params().get("structureId");
			final int xitiId = Integer.parseInt(request.params().get("xitiId"));

			service.upsertStructure(structureId, xitiId, DefaultResponseHandler.defaultResponseHandler(request));
		} catch (NumberFormatException n) {
			badRequest(request);
		}
	}

	@Put("/platform")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	@ResourceFilter(XitiFilter.class)
	public void setupPlatform(final HttpServerRequest request){
		RequestUtils.bodyToJson(request, new Handler<JsonObject>() {
			public void handle(JsonObject data) {
				service.upsertPlatform(data, DefaultResponseHandler.defaultResponseHandler(request));
			}
		});
	}

}
