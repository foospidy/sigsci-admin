function invalid_session() {
    alert('Session expired, please login.');
    location.href = '/logout';
}
function get_corp_sites() {
    $.ajax({
        url: "/corp_sites",
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
        url: "/request_rules?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
            var conditions = val.conditions;
            var condition_string = '';
            for(var i=0; i<conditions.length; i++) {
                var condition = conditions[i];
                condition_string += condition.field + " " + condition.operator + " " + condition.value + "\n";
            }

            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.id + '"> \
                    <input class="config" type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/requestRules/' + val.id + '" class="edit_rule" target="_new">' + val.id + '</a> \
                    <div>' + val.reason + '</div> \
                    <pre>' + condition_string + '</pre></div>';
            html += '</div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;

        get_sites_multi_select(exclude_site=name);
    });
}

function get_signal_rules(corp, name) {
    toggle_tabs('signal_rules');
    $.ajax({
        url: "/signal_rules?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                    <input class="config" type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/signalRules/' + val.id + '" class="edit_rule" target="_new">' + val.id + '</a> \
                    <div>' + val.reason + '</div> \
                    <pre>' + condition_string + '</pre></div>';
            html += '</div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_templated_rules(corp, name) {
    toggle_tabs('templated_rules');
    $.ajax({
        url: "/templated_rules?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                        <input class="config" type="checkbox" value="' + val.name + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/templatedRules/' + val.name + '/edit" class="edit_rule" target="_new">' + val.name + '</a></div>';
                html += '</div>';
            }
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_advanced_rules(corp, name) {
    toggle_tabs('advanced_rules');
    $.ajax({
        url: "/advanced_rules?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                    <input class="config" type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/advancedRules/' + val.id + '" class="edit_rule" target="_new">' + val.shortName + '</a>';
            html += '</div></div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_rule_lists(corp, name) {
    toggle_tabs('lists');
    $.ajax({
        url: "/rule_lists?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                    <input class="config" type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/ruleLists/' + val.name + '" class="edit_rule" target="_new">' + val.name + '</a> \
                    <div>' + val.description + '</div>';
            html += '</div></div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_custom_signals(corp, name) {
    toggle_tabs('custom_signals');
    $.ajax({
        url: "/custom_signals?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                    <input class="config" type="checkbox" value="' + val.tagName + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/tags/' + val.tagName + '/edit" class="edit_rule" target="_new">' + val.tagName + '</a> \
                    <div>' + val.description + '</div>';
            html += '</div></div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_custom_alerts(corp, name) {
    toggle_tabs('custom_alerts');
    $.ajax({
        url: "/custom_alerts?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                        <input class="config" type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/alerts/' + val.id + '/edit" class="edit_rule" target="_new">' + val.tagName + '</a> \
                        <div>' + val.longName + '</div>';
                html += '</div></div>';
            }
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_redactions(corp, name) {
    toggle_tabs('redactions');
    $.ajax({
        url: "/redactions?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                    <input class="config" type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/redactions/' + val.id + '/edit" class="edit_rule" target="_new">' + val.field + '</a>';
            html += '</div></div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_header_links(corp, name) {
    toggle_tabs('header_links');
    $.ajax({
        url: "/header_links?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                    <input class="config" type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/header-links/" class="edit_rule" target="_new">' + val.linkName + '</a>';
            html += '</div></div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_integrations(corp, name) {
    toggle_tabs('integrations');
    $.ajax({
        url: "/integrations?name=" + name,
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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
                    <input class="config" type="checkbox" value="' + val.id + '"> <a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + name + '/integrations/" class="edit_rule" target="_new">' + val.name + '</a> \
                    <div>' + val.url + '</div>';
            html += '</div></div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select(exclude_site=name);
    });
}

function get_sites_dropdown(exclude_site) {
    var html = '';

    $.ajax({
        url: "/corp_sites",
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
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

function get_sites_multi_select(exclude_site) {
    var html = '';

    $.ajax({
        url: "/corp_sites",
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
    })
    .done(function(data) {
        html += '<select multiple="multiple" id="copy_to_these_sites">';

        sites = [];

        $.each(data['data'], function(key, val) {
            fields = [val.name, val.displayName];
            sites.push(fields);
        });

        sites.sort();

        $.each(sites, function(key, val) {
            if(exclude_site != val[0]) {
                html += '<option class="site_select" value="' + val[0] + '">' + val[1] + '</option>';
            }
        });

        html += '</select>';

        document.getElementById("copy_to_site").innerHTML = html;
        $("#copy_to_these_sites").multiselect({
            includeSelectAllOption: true
        })
    });
}

function get_corp_users(corp) {
    toggle_tabs('by_users');

    $.ajax({
        url: "/corp_users",
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
    })
    .done(function(data) {
        var html = '';
        var members = [];

        html += '<h3 style="margin-left:125px">By Users</h3>';
        html += '<br />';
        html += '<div class="container-fluid" style="margin-left:125px">';

        $.each(data['data'], function(key, val) {
            members.push(val.email);
            html += '<div class="row">';
            html += '<div class="col-sm-4" id="' + val.email + '">' + val.name + ' (<a href="https://dashboard.signalsciences.net/corps/' + corp + '/users/' + val.email + '/edit" target="_new">' + val.email + '</a>)</div>';
            html += '<br><div id="memberships-' + val.email + '"></div>';
            html += '</div><br>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
    })
    .done(function(data) {
        $.each(data['data'], function(key, val) {
            $.ajax({
                url: "/memberships?email=" + val.email
            })
            .done(function(data) {
                html = '';
                $.each(data['data'], function(key, val) {
                    html += '<div> &nbsp;  &nbsp;  &nbsp; ' + val.site['name'] + '</div>';
                });
                document.getElementById("memberships-" + val.email).innerHTML = html;
            });
        });
    })
    .fail(function() {
        console.log('error');
    });
}

function get_users_by_site(corp) {
    toggle_tabs('by_site');

    $.ajax({
        url: "/corp_sites",
        statusCode: {
            401: function() {
              invalid_session();
            }
        }
    })
    .done(function(data) {
        var html = '';
        var members = [];

        html += '<h3 style="margin-left:125px">By Sites</h3>';
        html += '<br />';
        html += '<div class="container-fluid" style="margin-left:125px">';

        $.each(data['data'], function(key, val) {
            //members.push(val.email);
            html += '<div class="row">';
            html += '<div class="col-sm-4" id="' + val.name + '">' + val.name + ' (<a href="https://dashboard.signalsciences.net/corps/' + corp + '/sites/' + val.name + '/members" target="_new">' + val.displayName + '</a>)</div>';
            html += '<br><div id="members-' + val.name + '"></div>';
            html += '</div><br>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
    })
    .done(function(data) {
        $.each(data['data'], function(key, val) {
            var site = val.name;
            $.ajax({
                url: "/site_members?site=" + site
            })
            .done(function(data) {
                html = '';
                $.each(data['data'], function(key, val) {
                    html += '<div> &nbsp;  &nbsp;  &nbsp; ' + val.user.name + ' - ' + val.user.email + ' (' + val.role + ')</div>';
                });
                document.getElementById("members-" + site).innerHTML = html;
            });
        });
    })
    .fail(function() {
        console.log('error');
    });
}

function get_power_rule_packs() {
    $.ajax({
        url: "https://raw.githubusercontent.com/foospidy/sigsci-power-rules/master/index.json",
        statusCode: {
            401: function() {
              invalid_session();
            },
            404: function () {
                alert('Github: permission denied.')
            }
        }
    })
    .done(function(data) {
        var html = '';
        
        html += '<h3 style="margin-left:125px">Power Rule Rule Packs</h3>';
        html += '<div style="margin-left:125px">Deploy to:  <table><tr><td><span id="copy_to_site"></span> </td><td> <input type="button" value="Deploy" onclick="deploy_power_rule_packs();" class="btn btn-default"></td></tr></table></div>';
        html += '<br />';
        html += '<div class="container-fluid" style="margin-left:125px; width:100%">';

        html += '<div class="row" style="width:100%">';
        html += '<div class="col-sm-4" style="background-color:#DDDDDD"> <input type="checkbox" id="check_all" onchange="toggle_checks()"> Select all<hr></div></div>';

        var obj = JSON.parse(data);
        $.each(obj['rule-packs'], function(key, val) {
            html += '<div class="row">';
            html += '<div class="col-sm-4" style="background-color:#DDDDDD" id="' + val.name + '"> \
                    <input class="config" type="checkbox" value="' + val.name + '"> <a href="https://github.com/foospidy/sigsci-power-rules/tree/master/power-rules-' + val.name + '" class="edit_rule" target="_new">' + val.display_name + '</a> \
                    <div>' + val.description + '</div>';
            html += '</div></div>';
        });

        html += '</div>';

        document.getElementById("content").innerHTML = html;
        get_sites_multi_select();
    })
    .fail(function() {
        console.log('error');
    });
}

function deploy_power_rule_packs() {
    var target_site = '';
    var site_list = document.getElementsByClassName("site_select");

    for(var i=0; i < site_list.length; i++) {
        if(site_list[i].tagName == "OPTION" && site_list[i].selected) {
            target_site = site_list[i].value;

            var inputs = document.getElementsByClassName("config");

            for(var j = 0; j < inputs.length; j++) {
                if(inputs[j].type == "checkbox" ) {
                    if(inputs[j].checked) {
                        $.ajax({
                            url: "/deploy_power_rules?target=" + target_site + "&rulepack=" + inputs[j].value,
                            method: "GET",
                            statusCode: {
                                401: function() {
                                  invalid_session();
                                }
                            }
                        }).fail(function(xhr) {
                            response = JSON.parse(xhr.responseText);
                            $.notify({ message: "Deploying rule failed."}, { type: "danger", animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp"} });
                        }).done(function(xhr) {
                            if(xhr.status == 'failed') {
                                $.notify({ message: "Deploying rule failed: " + xhr.message + "." }, { type: "danger", animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp"} });
                            } else {
                                $.notify({ message: "Deploying rule successful."}, { type: "info", animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp"} });
                            }
                        });
                        
                    }
                }
            }
        }
    }
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
        if(inputs[i].type == "checkbox" && (inputs[i].className.indexOf('config') > -1)) {
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
    var site_list = document.getElementsByClassName("site_select");

    for(var i=0; i < site_list.length; i++) {
        if(site_list[i].tagName == "OPTION" && site_list[i].selected) {
            target_site = site_list[i].value;

            var inputs = document.getElementsByClassName("config");

            for(var j = 0; j < inputs.length; j++) {
                if(inputs[j].type == "checkbox" ) {
                    if(inputs[j].checked) {
                        $.ajax({
                            url: "/copy_configuration?type=" + type + "&target=" + target_site,
                            dataType: "json",
                            data: { identifier: inputs[j].value },
                            method: "POST",
                            statusCode: {
                                401: function() {
                                  invalid_session();
                                }
                            }
                        }).fail(function(xhr) {
                            response = JSON.parse(xhr.responseText);
                            $.notify({ message: "Copy failed."}, { type: "danger", animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp"} });
                        }).done(function(xhr) {
                            if(xhr.status == 'failed') {
                                $.notify({ message: "Copy failed: " + xhr.message + "." }, { type: "danger", animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp"} });
                            } else {
                                $.notify({ message: "Copy successful."}, { type: "info", animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp"} });
                            }
                        });
                    }
                }
            }
        }
    }
}