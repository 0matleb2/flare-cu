import { findRoute } from "./src/routing/GraphRouter";

const route = findRoute({
	startId: "guy_demaisonneuve",
	endId: "H",
});

console.log(JSON.stringify(route, null, 2));
