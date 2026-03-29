import * as gsGrid from '../../../../src';
import { IGridColumn } from '../../../../src/interface';
import { GridConfig, GridEvents } from '../../../../src/model';

class DemoHome {
    usersList: any[] = [];
    gridConfig: GridConfig<any>;

    constructor() {
        const gsGridRef = gsGrid;
        
        // setup grid config.
        this.setupGridAndApplyData();
    }

    buildGridColumns(): IGridColumn[] {
        return [
            {
                field: 'name',
                headerName: 'Name',
                enableSort: true
            },
            {
                field: 'age',
                headerName: 'Age',
                width: 80,
                enableSort: true
            },
            {
                field: 'username',
                headerName: 'User name',
                enableSort: true
            },
            {
                field: 'email',
                headerName: 'Email',
                enableSort: true
            },
            {
                field: 'phone',
                headerName: 'Phone',
                enableSort: true
            },
            {
                field: 'gender',
                headerName: 'Gender',
                width: 100,
                enableSort: true
            },
            {
                field: 'location.city',
                headerName: 'City',
                width: 140,
                enableSort: true
            },
            {
                field: 'location.country',
                headerName: 'Country',
                width: 120,
                enableSort: true
            }
        ];
    }

    async setupGridAndApplyData() {
        this.gridConfig = new GridConfig();
        this.gridConfig.columnDefs = this.buildGridColumns();
        this.gridConfig.rowHeight = 31;

        this.gridConfig.data = await this.getUsers();
        const gridEl = document.querySelector('gs-grid');
        if (gridEl) {
            GridEvents.setupGridConfig(gridEl.getAttribute('instance-id'), this.gridConfig);
        }
    }

    async onSearchInput(_: any, event: Event) {
        if (!this.gridConfig || !this.gridConfig.performSearch) {
            return;
        }

        const target = event.target as HTMLInputElement;
        await this.gridConfig.performSearch(target ? target.value : '');
    }

    async clearSearch() {
        if (!this.gridConfig || !this.gridConfig.performSearch) {
            return;
        }

        const searchInput = document.getElementById('demo-grid-search') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = '';
        }

        await this.gridConfig.performSearch('');
    }

    async getUsers() {
        const response = await fetch('https://randomuser.me/api/?results=200&seed=gsGrid');
        const json = await response.json();
        return (json.results as any[]).map(u => ({
            name: `${u.name.first} ${u.name.last}`,
            username: u.login.username,
            email: u.email,
            phone: u.phone,
            gender: u.gender,
            location: { city: u.location.city, country: u.location.country },
            age: u.dob.age
        }));
    }
}

export default { viewModel: DemoHome, template: require('./demo-home.html') }