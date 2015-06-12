package fr.wseduc.xiti;

import org.entcore.common.http.BaseServer;

import fr.wseduc.xiti.controllers.XitiController;
import fr.wseduc.xiti.filters.XitiFilter;

public class Xiti extends BaseServer {

	private static final String collection = "Xiti";

	@Override
	public void start() {
		super.start();
		addController(new XitiController(collection));
	}

}
