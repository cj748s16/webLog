export const APP_MENU = [
    {
        path: "/home",
        data: {
            menu: {
                title: "Home",
                icon: "fa fa-home fa-fw",
                selected: false,
                expanded: false,
                order: 0
            }
        }
    },
    {
        path: "account",
        data: {
            menu: {
                title: "Menu.Account",
                icon: "fa fa-user fa-fw",
            }
        },
        children: [
            {
                path: "user/list",
                data: {
                    menu: {
                        title: "Menu.Users",
                        icon: "fa fa-user fa-fw",
                        selected: false,
                        expanded: false,
                        order: 0
                    }
                }
            },
            {
                path: "group/list",
                data: {
                    menu: {
                        title: "Menu.Groups",
                        icon: "fa fa-group fa-fw",
                        selected: false,
                        expanded: false,
                        order: 100
                    }
                }
            }
        ]
    }
];