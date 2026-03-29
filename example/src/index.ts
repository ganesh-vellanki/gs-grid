import { ComponentRegistry } from './components/component-registry';
import { RouteInfo, Router } from './router';

const ko = (window as any).ko;

class GridAppViewModel {
    routerHatchId = 'koRouterHatch';
    router: Router;
    routes: RouteInfo[];
    componentView: any;

    constructor() {
        ComponentRegistry.registerAppComponents(ko);
        this.componentView = ko.observable('home');
        this.initializeRouter();
    }

    initializeRouter() {
        this.router = new Router(this.routerHatchId, this.componentView);
        this.router.addRoutes(this.getRoutes());
    }

    getRoutes() {
        return [
            new RouteInfo(
                {
                    path: '/',
                    componentTag: 'home'
                }
            ),
            new RouteInfo(
                {
                    path: '/demo',
                    componentTag: 'demo'
                }
            ),
            new RouteInfo(
                {
                    path: '/get-started',
                    componentTag: 'get-started'
                }
            ),
            new RouteInfo(
                {
                    path: '/what-and-why',
                    componentTag: 'what-and-why'
                }
            )
        ];
    }
}

const root = document.getElementById('gridApp');
if (root) {
    ko.applyBindings(new GridAppViewModel(), root);
}