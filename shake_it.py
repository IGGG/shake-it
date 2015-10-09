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
        my_count=counts.get(user_id, 0),
        all_count=sum(counts.values()),
    ))

    if not user_id:
        uuid_str = str(uuid.uuid4())
        response.set_cookie('uuid', uuid_str)
        counts[uuid_str] = 0

    return response


@app.route('/api/client', methods=['POST'])
def push_from_client():
    print(counts)
    user_id = request.cookies.get('uuid')
    if not user_id:
        return jsonify(message='uuid not set'), 404

    counts[user_id] = int(request.form['count'])
    return jsonify(yours=counts[user_id], all=sum(counts.values()))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
