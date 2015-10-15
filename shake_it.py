import uuid

from flask import Flask
from flask import (
    request,
    make_response,
    render_template,
    jsonify,
)

app = Flask(__name__)

counts = {}


@app.route('/')
def index():
    user_id = request.cookies.get('uuid')

    response = make_response(render_template(
        'top.html',
        count=counts.get(user_id, 0),
    ))

    if not user_id:
        uuid_str = str(uuid.uuid4())
        response.set_cookie('uuid', uuid_str)
        counts[uuid_str] = 0

    return response


@app.route('/info')
def info():
    return render_template('info.html', count=sum(counts.values()))


@app.route('/api/client', methods=['POST'])
def push_from_client():
    user_id = request.cookies.get('uuid')
    if not user_id:
        return jsonify(message='uuid not set'), 404

    counts[user_id] = int(request.form['count'])
    return '', 204


@app.route('/api/info')
def main_data():
    return jsonify(count=sum(counts.values()))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
