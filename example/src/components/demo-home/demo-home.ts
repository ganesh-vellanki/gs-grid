import * as gsGrid from '../../../../src';
import { IGridColumn } from '../../../../src/interface';
import { GridConfig, GridEvents } from '../../../../src/model';

class DemoHome {
    usersList: any[] = [];

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
        const gridConfig = new GridConfig();
        gridConfig.columnDefs = this.buildGridColumns();
        gridConfig.rowHeight = 31;

        gridConfig.data = await this.getUsers();
        const gridEl = document.querySelector('gs-grid');
        if (gridEl) {
            GridEvents.setupGridConfig(gridEl.getAttribute('instance-id'), gridConfig);
        }
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