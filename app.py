import os
from flask import Flask, session, render_template, request, redirect, url_for, send_from_directory, abort, jsonify
import requests
from pysigsci import sigsciapi

app = Flask(__name__, static_url_path='/static')

secret_key = os.environ.get('FLASK_SECRET_KEY', None)

if secret_key is not None:
    app.secret_key = os.environ['FLASK_SECRET_KEY']
else:
    app.secret_key = open("/dev/random","rb").read(32)


@app.route('/corp_sites', methods=['GET'])
def get_corp_sites():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']

    if 'token' in sigsci.token:
        response = sigsci.get_corp_sites()
    else:
        abort(401)

    return jsonify(response)

@app.route('/request_rules', methods=['GET'])
def get_request_rules():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_request_rules()
    else:
        abort(401)

    return jsonify(response)

@app.route('/signal_rules', methods=['GET'])
def get_signal_rules():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_signal_rules()
    else:
        abort(401)

    return jsonify(response)

@app.route('/templated_rules', methods=['GET'])
def get_templated_rules():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_templated_rules()
    else:
        abort(401)

    return jsonify(response)

@app.route('/advanced_rules', methods=['GET'])
def get_advanced_rules():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_advanced_rules()
    else:
        abort(401)

    return jsonify(response)

@app.route('/rule_lists', methods=['GET'])
def get_rule_lists():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_rule_lists()
    else:
        abort(401)

    return jsonify(response)

@app.route('/custom_signals', methods=['GET'])
def get_custom_signals():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_custom_signals()
    else:
        abort(401)

    return jsonify(response)

@app.route('/custom_alerts', methods=['GET'])
def get_custom_alerts():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_custom_alerts()
    else:
        abort(401)

    return jsonify(response)

@app.route('/redactions', methods=['GET'])
def get_redactions():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_redactions()
    else:
        abort(401)

    return jsonify(response)

@app.route('/header_links', methods=['GET'])
def get_header_links():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_header_links()
    else:
        abort(401)

    return jsonify(response)

@app.route('/integrations', methods=['GET'])
def get_integrations():
    if 'username' not in session:
        abort(401)

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = request.args.get('name', None)

    if 'token' in sigsci.token:
        response = sigsci.get_integrations()
    else:
        abort(401)

    return jsonify(response)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/login', methods=['POST'])
def login():
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

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('default'))

@app.route('/')
def default():
    javascript = 'get_corp_sites();'
    return render_template('index.html', javascript=javascript)

@app.route('/site')
def site():
    if 'username' not in session:
        abort(401)

    name = request.args.get('name', None)
    display_name = ''

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']

    if 'token' in sigsci.token:
        site = sigsci.get_corp_site(name)
    else:
        abort(401)

    display_name = site['displayName']
    session['site'] = site['name']

    javascript = 'get_request_rules("{}", "{}");'.format(session['corp'], name)
    return render_template('site.html', javascript=javascript, display_name=display_name)

@app.route('/copy_configuration', methods=['POST'])
def copy_configuration():
    if 'username' not in session:
        abort(401)

    config_type = request.args.get('type', None)
    target_site = request.args.get('target', None)
    config_data = None

    sigsci = sigsciapi.SigSciApi(session['username'], session['password'])
    sigsci.corp = session['corp']
    sigsci.site = session['site']

    if 'token' in sigsci.token:
        #site = sigsci.get_corp_site(name)
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
                payload = { 'alertAdds': [], 'alertDeletes': [], 'alertUpdates': [], 'detectionAdds': [], "detectionDeletes": [], "detectionUpdates": [] }

                # let's gather up the detections
                for config in config_data['data']:
                    for detection in config['detections']:
                        if identifier == config['name']:
                            # this is the signal we want
                            # disable rule before copying
                            d = {'name':detection['name'], 'enabled':False, 'fields':detection['fields']}
                            payload['detectionAdds'].append(d)

                for config in config_data['data']:
                    for alert in config['alerts']:
                        if identifier == alert['tagName']:
                            # this is the signal we want
                            # disable rule before copying
                            a = {'action':alert['action'], 'enabled':False, 'interval':alert['interval'],
                            'skipNotifications':alert['skipNotifications'], 'longName':alert['longName'], 'threshold':alert['threshold']}
                            payload['alertAdds'].append(a)

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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

