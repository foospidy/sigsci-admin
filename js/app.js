function get_corp_sites() {
    $.ajax({
        url: "/corp_sites"
        })
        .done(function(data) {
            var html = '';
            sites = [];

            $.each(data['data'], function(key, val) {
                fields = [val.displayName, val.name, val.agentLevel];
                sites.push(fields);
            });

            sites.sort();

            html += '<div class="container-fluid">';

            $.each(sites, function(key, val) {
                color = '#FFCCCC';
                if(val[2] == 'block') {
                    color = '#DDFFDD';
                } else if(val[2] == 'log') {
                    color = '#FFFFCC';
                }

                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:' + color + ';">' + val[0] + ' (<a href="/site?name=' + val[1] + '">' + val[1] + '</a>)</div>';
                html += '<div class="col-sm-4" style="background-color:' + color + ';">' + val[2] + '</div>';
                html += '</div>';
            });

            html += '</div>';

            document.getElementById("content").innerHTML = html;
        });
}

function get_request_rules(corp, name) {
    toggle_tabs('request_rules');
    $.ajax({
        url: "/request_rules?name=" + name
        })
        .done(function(data) {
            var html = '';

            html += '<h3 style="margin-left:125px">Request Rules</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'request_rules\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> \
            <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                //fields = [val.displayName, val.name, val.agentLevel];
                //rules.push(fields);
                var conditions = val.conditions;
                var condition_string = '';
                for(var i=0; i<conditions.length; i++) {
                    var condition = conditions[i];
                    condition_string += condition.field + " " + condition.operator + " " + condition.value + "\n";
                }

                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                        <input type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/requestRules/' + val.id + '" class="edit_rule" target="_new">' + val.id + '</a> \
                        <div>' + val.reason + '</div> \
                        <pre>' + condition_string + '</pre></div>';
                html += '</div>';
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_signal_rules(corp, name) {
    toggle_tabs('signal_rules');
    $.ajax({
        url: "/signal_rules?name=" + name
        })
        .done(function(data) {
            var html = '';

            html += '<h3 style="margin-left:125px">Signal Rules</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'signal_rules\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                var conditions = val.conditions;
                var condition_string = '';
                for(var i=0; i<conditions.length; i++) {
                    var condition = conditions[i];
                    condition_string += condition.field + " " + condition.operator + " " + condition.value + "\n";
                }

                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                        <input type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/signalRules/' + val.id + '" class="edit_rule" target="_new">' + val.id + '</a> \
                        <div>' + val.reason + '</div> \
                        <pre>' + condition_string + '</pre></div>';
                html += '</div>';
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_templated_rules(corp, name) {
    toggle_tabs('templated_rules');
    $.ajax({
        url: "/templated_rules?name=" + name
    })
    .done(function(data) {
        var html = '';
        var applicable_templated_rules = ["LOGINATTEMPT", "LOGINFAILURE", "LOGINSUCCESS", "REGATTEMPT", "REGFAILURE", "REGSUCCESS"];
        
        html += '<h3 style="margin-left:125px">Templated Rules</h3>';
        html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'templated_rules\');" class="btn btn-default"></td></tr></table></div>';
        html += '<br />';
        html += '<div class="container-fluid" style="margin-left:125px">';

        html += '<div class="row">';
        html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

        $.each(data['data'], function(key, val) {
            if(applicable_templated_rules.includes(val.name)) {
                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.name + '"> \
                        <input type="checkbox" value="' + val.name + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/templatedRules/' + val.name + '/edit" class="edit_rule" target="_new">' + val.name + '</a></div>';
                html += '</div>';
            }
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_dropdown(exclude_site=name);
    });
}

function get_advanced_rules(corp, name) {
    toggle_tabs('advanced_rules');
    $.ajax({
        url: "/advanced_rules?name=" + name
        })
        .done(function(data) {
            var html = '';

            html += '<h3 style="margin-left:125px">Advanced Rules</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'advanced_rules\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                        <input type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/advancedRules/' + val.id + '" class="edit_rule" target="_new">' + val.shortName + '</a>';
                html += '</div></div>';
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_rule_lists(corp, name) {
    toggle_tabs('lists');
    $.ajax({
        url: "/rule_lists?name=" + name
        })
        .done(function(data) {
            var html = '';

            html += '<h3 style="margin-left:125px">Lists</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'rule_lists\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                        <input type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/ruleLists/' + val.name + '" class="edit_rule" target="_new">' + val.name + '</a> \
                        <div>' + val.description + '</div>';
                html += '</div></div>';
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_custom_signals(corp, name) {
    toggle_tabs('custom_signals');
    $.ajax({
        url: "/custom_signals?name=" + name
        })
        .done(function(data) {
            var html = '';

            html += '<h3 style="margin-left:125px">Custom Signals</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'custom_signals\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.tagName + '"> \
                        <input type="checkbox" value="' + val.tagName + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/tags/' + val.tagName + '/edit" class="edit_rule" target="_new">' + val.tagName + '</a> \
                        <div>' + val.description + '</div>';
                html += '</div></div>';
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_custom_alerts(corp, name) {
    toggle_tabs('custom_alerts');
    $.ajax({
        url: "/custom_alerts?name=" + name
        })
        .done(function(data) {
            var html = '';
            var applicable_templated_rules = ["CVE-2017-9805", "CVE-2017-5638", "CVE-2017-7269", "requests_total", "agent_scoreboards"];
            
            html += '<h3 style="margin-left:125px">Custom Alerts</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'custom_alerts\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                if(!applicable_templated_rules.includes(val.tagName)) {
                    html += '<div class="row">';
                    html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                            <input type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/alerts/' + val.id + '/edit" class="edit_rule" target="_new">' + val.tagName + '</a> \
                            <div>' + val.longName + '</div>';
                    html += '</div></div>';
                }
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_redactions(corp, name) {
    toggle_tabs('redactions');
    $.ajax({
        url: "/redactions?name=" + name
        })
        .done(function(data) {
            var html = '';
            
            html += '<h3 style="margin-left:125px">Redactions</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'redactions\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                        <input type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/redactions/' + val.id + '/edit" class="edit_rule" target="_new">' + val.field + '</a>';
                html += '</div></div>';
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_header_links(corp, name) {
    toggle_tabs('header_links');
    $.ajax({
        url: "/header_links?name=" + name
        })
        .done(function(data) {
            var html = '';
            
            html += '<h3 style="margin-left:125px">Header Links</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'header_links\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                        <input type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/header-links/" class="edit_rule" target="_new">' + val.linkName + '</a>';
                html += '</div></div>';
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_integrations(corp, name) {
    toggle_tabs('integrations');
    $.ajax({
        url: "/integrations?name=" + name
        })
        .done(function(data) {
            var html = '';
            
            html += '<h3 style="margin-left:125px">Integrations</h3>';
            html += '<div style="margin-left:125px">Copy selected to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Copy" onclick="copy_configuration(\'integrations\');" class="btn btn-default"></td></tr></table></div>';
            html += '<br />';
            html += '<div class="container-fluid" style="margin-left:125px">';

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

            $.each(data['data'], function(key, val) {
                html += '<div class="row">';
                html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                        <input type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/integrations/" class="edit_rule" target="_new">' + val.name + '</a> \
                        <div>' + val.url + '</div>';
                html += '</div></div>';
            });

            html += '</div>';

           document.getElementById("content").innerHTML = html;
           get_sites_dropdown(exclude_site=name);
        });
}

function get_sites_dropdown(exclude_site) {
    var html = '';

    $.ajax({
        url: "/corp_sites"
        })
        .done(function(data) {
            html += '<div class="dropdown">';
            html += '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">';
            html += '<span id="selected">Select..</span>';
            html += '<span class="caret"></span></button>';
            html += '<ul class="dropdown-menu" id="copy_to_this_site">';

            sites = [];

            $.each(data['data'], function(key, val) {
                fields = [val.name, val.displayName];
                sites.push(fields);
            });

            sites.sort();

            $.each(sites, function(key, val) {
                if(exclude_site != val[0]) {
                    html += '<li><a href="#' + val[0] + '" onclick="$(\'.btn:first-child\').text($(this).text());">' + val[1] + '</a></li>';
                }
            });

            html += '</ul></div>';

            document.getElementById("copy_to_site").innerHTML = html;
    });
}

function toggle_tabs(tab_name) {
    var inputs = document.getElementById('tab-list').childNodes;
    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].id == tab_name) {
            inputs[i].className = 'active';
        } else {
            inputs[i].className = 'inactive';
        }
    }
}

function toggle_checks() {
    var inputs = document.getElementsByTagName("input");

    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type == "checkbox") {
            if(inputs[i].id != 'check_all') {
                if(document.getElementById('check_all').checked == false) {
                    inputs[i].checked = false;
                } else {
                    inputs[i].checked = true;
                }
            }
        }
    }
}

function copy_configuration(type) {
    var target_site = '';

    if(window.location.hash) {
        target_site = window.location.hash.replace('#', '');
    } else {
        // no selection
        return;
    }

    var inputs = document.getElementsByTagName("input");

    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type == "checkbox") {
            if(inputs[i].id != 'check_all') {
                if(inputs[i].checked == true) {
                    $.ajax({
                        url: "/copy_configuration?type=" + type + "&target=" + target_site,
                        dataType: "json",
                        data: { identifier: inputs[i].value},
                        method: "POST"
                    }).fail(function() {
                        $.notify({ message: "Copy failed."}, { type: "danger", animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp"} });
                        return;
                    }).done(function(xhr) {
                        console.log(xhr);
                        $.notify({ message: "Copy successful."}, { type: "info", animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp"} });
                        return;
                    });
                }
            }
        }
    }
}