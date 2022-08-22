// get parameters from url
var actions = {
    getCurrentURL: function() {
        return window.location.href;
    },
    getUrlVars: function(testData) {
        var vars = {};
        var url = this.getCurrentURL();

        url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }
}

function showCode() {
    var code = Blockly.JavaScript.workspaceToCode(workspace)
    alert(code)
}