Xrm.App.sidePanes.createPane({
    title: "Accounts",
    imageSrc: "/_imgs/svg_1.svg",
    paneId: "AccountList",
    canClose: false
}).then((pane) => {
    pane.navigate({
        pageType: "entitylist",
        entityName: "account",
    })
});

Xrm.App.sidePanes.createPane({
    title: "Web Resource",
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Icon_WebResource_DigitalPreservation.png",
    paneId: "Dynamics T365",
    hideHeader: true,
    canClose: true
}).then((pane) => {
    pane.navigate({
        pageType: "webresource",
        webresourceName: "https://apps.powerapps.com/play/e/default-24182168-d96b-4412-8419-98c6e8ed94fc/a/addc6193-90bb-481e-9880-573d6444b244?tenantId=24182168-d96b-4412-8419-98c6e8ed94fc&hint=5feed9a8-6dd0-44df-98a1-93408888c7df&sourcetime=1705050021633",
    })
});


