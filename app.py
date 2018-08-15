"""
Admin Tool for Signal Sciences
"""
import os
from flask import Flask, session, render_template, request, \
                  redirect, url_for, send_from_directory, abort, jsonify
from pysigsci import sigsciapi
import json

APP = Flask(__name__, static_url_path='/static')

SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', None)

if SECRET_KEY is not None:
    APP.secret_key = os.environ['FLASK_SECRET_KEY']
else:
    # APP.secret_key = open("/dev/random", "rb").read(32)
    APP.secret_key = os.urandom(32)


@APP.route('/corp_sites', methods=['GET'])
def get_corp_sites():
    """
    Return list of corp sites from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']

    if 'token' in sigsci.token:
        response = sigsci.get_corp_sites()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/request_rules', methods=['GET'])
def get_request_rules():
    """
    Return request rules from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_request_rules()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/signal_rules', methods=['GET'])
def get_signal_rules():
    """
    Return signal rules from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_signal_rules()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/templated_rules', methods=['GET'])
def get_templated_rules():
    """
    Return templated rules from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_templated_rules()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/advanced_rules', methods=['GET'])
def get_advanced_rules():
    """
    Return advanced rules from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_advanced_rules()
    else:
        abort(401)

    return jsonify(response)


@APP.route('/advanced_rule_editor', methods=['GET', 'POST'])
def load_editor():
    """
    Return advanced rules from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)
    sigsci.id = request.args.get('id', None)

    if 'token' in sigsci.token:
        if request.method == 'GET':
            response = sigsci.get_advanced_rules()
        else:
            baseUrl = "https://dashboard.signalsciences.net/api/v0"
            advancedRuleEndpoint = "{}/corps/{}/sites/{}/advancedRules/{}/test".format(
                baseUrl, sigsci.corp, sigsci.site, sigsci.id)

            if not request.json:
                abort(400)
            payload = json.dumps(request.json)

            response = sigsci._make_request(
                endpoint=advancedRuleEndpoint, method="POST", json=payload)

            if 'message' in response:
                result = '{{"status": "failed", "message": {}}}'.format(response['message'])
            else:
                result = response
            
            return result
    else:
        abort(401)

    return jsonify(response)
    # return render_template(response)


@APP.route('/rule_lists', methods=['GET'])
def get_rule_lists():
    """
    Return rule lists from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_rule_lists()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/custom_signals', methods=['GET'])
def get_custom_signals():
    """
    Return custom signals from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_custom_signals()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/custom_alerts', methods=['GET'])
def get_custom_alerts():
    """
    Return custom alerts from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_custom_alerts()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/redactions', methods=['GET'])
def get_redactions():
    """
    Return redactions from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_redactions()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/header_links', methods=['GET'])
def get_header_links():
    """
    Return header links from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_header_links()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/integrations', methods=['GET'])
def get_integrations():
    """
    Return integrations from SigSci API.
    """
    if 'username' not in session:
        return redirect("/", code=302)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_integrations()
    else:
        abort(401)

    return jsonify(response)

@APP.route('/js/<path:path>')
def send_js(path):
    """
    Route for javascript files
    """
    return send_from_directory('js', path)

@APP.route('/login', methods=['POST'])
def login():
    """
    Route for login
    """
    email = request.form.get('email', None)
    password = request.form.get('password', None)
    sigsci = sigsciapi.SigSciApi(email, password)

    result = "False"

    if 'token' in sigsci.token:
        result = "True"

        sigsci.corp = sigsci.get_corps()['data'][0]['name']

        user = sigsci.get_corp_user(email)

        if 'message' in user:
            abort(403)
        else:
            session['username'] = email
            session['password'] = password
            session['corp'] = sigsci.corp
            session['name'] = user['name']
            session['role'] = user['role']

        return redirect(url_for('default'))

    return render_template('index.html', result=result)

@APP.route('/logout')
def logout():
    """
    Route for logout
    """
    # Remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('default'))

@APP.route('/')
def default():
    """
    Route for default page
    """
    javascript = 'get_corp_sites();'
    return render_template('index.html', javascript=javascript)

@APP.route('/favicon.ico')
def favicon():
    """
    Route for favicon
    """
    return send_from_directory(os.path.join(APP.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@APP.route('/logo.png')
def logo():
    """
    Route for logo image
    """
    return send_from_directory(os.path.join(APP.root_path, 'static'),
                               'sigsci-black.png', mimetype='image/png')

@APP.route('/github.png')
def github():
    """
    Route for github logo image
    """
    return send_from_directory(os.path.join(APP.root_path, 'static'),
                               'github.png', mimetype='image/png')

@APP.route('/site')
def site():
    """
    Route for site page
    """
    if 'username' not in session:
        return redirect("/", code=302)

    name = request.args.get('name', None)
    display_name = ''

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']

    if 'token' in sigsci.token:
        corp_site = sigsci.get_corp_site(name)
    else:
        abort(401)

    display_name = corp_site['displayName']
    session['site'] = corp_site['name']

    javascript = 'get_request_rules("{}", "{}");'.format(session['corp'], name)
    return render_template('site.html', javascript=javascript, display_name=display_name)


@APP.route('/copy_configuration', methods=['POST'])
def copy_configuration():
    """
    Route for copying configuration
    """
    if 'username' not in session:
        return redirect("/", code=302)

    config_type = request.args.get('type', None)
    target_site = request.args.get('target', None)
    config_data = None

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = session['site']

    if 'token' in sigsci.token:
        result = '{ "status": "success" }'
        identifier = request.form.get('identifier', None)

        if config_type == 'request_rules':
            config_data = sigsci.get_request_rules()
        elif config_type == 'signal_rules':
            config_data = sigsci.get_signal_rules()
        elif config_type == 'templated_rules':
            config_data = sigsci.get_templated_rules()
        elif config_type == 'advanced_rules':
            config_data = sigsci.get_advanced_rules()
        elif config_type == 'rule_lists':
            config_data = sigsci.get_rule_lists()
        elif config_type == 'custom_signals':
            config_data = sigsci.get_custom_signals()
        elif config_type == 'custom_alerts':
            config_data = sigsci.get_custom_alerts()
        elif config_type == 'redactions':
            config_data = sigsci.get_redactions()
        elif config_type == 'header_links':
            config_data = sigsci.get_header_links()
        elif config_type == 'integrations':
            config_data = sigsci.get_integrations()

        if 'data' in config_data:
            if config_type != 'templated_rules':
                for config in config_data['data']:

                    if 'id' not in config:
                         # a bit of a hack for objects that don't have an id
                        config['id'] = config['tagName']

                    if identifier == config['id']:
                        # this is the config we want, break out of loop
                        # disable config before copying
                        config['enabled'] = False

                        if 'id' in config:
                            del config['id']
                        if 'updated' in config:
                            del config['updated']
                        if 'created' in config:
                            del config['created']
                        if 'createdBy' in config:
                            del config['createdBy']
                        break
            else:
                # handle structure for templated rules
                # prep and build payload
                payload = {
                    'alertAdds': [],
                    'alertDeletes': [],
                    'alertUpdates': [],
                    'detectionAdds': [],
                    'detectionDeletes': [],
                    'detectionUpdates': []}

                # let's gather up the detections
                for config in config_data['data']:
                    for detection in config['detections']:
                        if identifier == config['name']:
                            # this is the signal we want
                            # disable rule before copying
                            detection_add = {'name':detection['name'], 'enabled':False,
                                             'fields':detection['fields']}
                            payload['detectionAdds'].append(detection_add)

                for config in config_data['data']:
                    for alert in config['alerts']:
                        if identifier == alert['tagName']:
                            # this is the signal we want
                            # disable rule before copying
                            alert_add = {'action':alert['action'], 'enabled':False,
                                         'interval':alert['interval'],
                                         'skipNotifications':alert['skipNotifications'],
                                         'longName':alert['longName'],
                                         'threshold':alert['threshold']}
                            payload['alertAdds'].append(alert_add)

        else:
            config = config_data

        # copy config to target site
        sigsci.site = target_site

        if config_type == 'request_rules':
            response = sigsci.add_request_rules(config)
        elif config_type == 'signal_rules':
            response = sigsci.add_signal_rules(config)
        elif config_type == 'templated_rules':
            response = sigsci.add_templated_rules(identifier, payload)
        elif config_type == 'advanced_rules':
            response = sigsci.add_advanced_rules(config)
        elif config_type == 'rule_lists':
            response = sigsci.add_rule_lists(config)
        elif config_type == 'custom_signals':
            response = sigsci.add_custom_signals(config)
        elif config_type == 'custom_alerts':
            response = sigsci.add_custom_alert(config)
        elif config_type == 'redactions':
            response = sigsci.add_redactions(config)
        elif config_type == 'header_links':
            response = sigsci.add_header_links(config)
        elif config_type == 'integrations':
            response = sigsci.add_integration(config)

        if 'message' in response:
            result = '{{"status": "failed", "message": {}}}'.format(response['message'])

    else:
        abort(401)

    return result

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    PORT = int(os.environ.get('PORT', 5000))
    APP.run(host='0.0.0.0', port=PORT)
