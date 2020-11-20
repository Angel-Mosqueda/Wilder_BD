from flask import Flask, jsonify, request, render_template
from flaskext.mysql import MySQL
import hashlib

app = Flask(
    __name__,
    template_folder='files',
    static_url_path='',
    static_folder='files'
)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'wilder'

mysql = MySQL(app)


def check_user():
    return True

def check_empresa():
    return True

@app.before_request
def check_cookie():
    response = {}
    # galleta = request.cookies.get('session_cookie')
    # if galleta is None:
    #     return response, 401
    # else:
    #     galleta_args = galleta.split(",")
    #     check_user(galleta_args[0])
    #     check_empresa(galleta_args[1])
    #     if not check_user and check_empresa:
    #     return response, 401
    

def root():
    response = {}
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM EMPLOYEES LIMIT 10;")
    mysql.connection.commit()
    rows = cur.fetchall()
    response["employees"] = {}
    counter = 0
    for i in rows:
        import pdb; pdb.set_trace()
        response["employees"]["emp" + str(counter)] = {}
        response["employees"]["emp" + str(counter)]["id"] = i[0]
        response["employees"]["emp" + str(counter)]["nacimiento"] = i[1]
        response["employees"]["emp" + str(counter)]["nombre"] = i[2]
        response["employees"]["emp" + str(counter)]["apellido"] = i[3]
        response["employees"]["emp" + str(counter)]["sexo"] = i[4]
        response["employees"]["emp" + str(counter)]["contratacion"] = i[5]
        counter = counter + 1
    cur.close()
    return jsonify(response)


@app.route('/', methods=['GET'])
def angular_root():
    return render_template('index.html')


@app.route('/get_ok/', methods=['GET'])
def enviar_ok():
    response = {
        'status': 'ok'
    }
    
    return jsonify(response)


@app.route('/add_empresa/', methods=['POST'])
def crear_empresa():
    response = {}
    cur = mysql.connection.cursor()
    query = ("INSERT INTO EMPRESA (NOMBRE,"
    "RAZSOC) VALUES ("
    + "'" + request.form['NOMBRE'] + "', "
    + "'" + request.form['RAZSOC'] + "');"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response = {
        'exito': isinstance(last_id, int),
        'id_insertado': last_id
    }
    cur.close()
    return jsonify(response)


@app.route('/add_user/', methods=['POST'])
def crear_usuario():
    response = {}
    cur = mysql.connection.cursor()
    query = ("INSERT INTO USUARIO (NOMBRE, APEPAT, APEMAT, ROL,"
    "FOTO, ACTIVO, EMPRESA_ID, CORREO, PASSWORD) VALUES ("
    + "'" + request.form['NOMBRE'] + "', "
    + "'" + request.form['APEPAT'] + "', "
    + "'" + request.form['APEMAT'] + "', "
    + "" + request.form['ROL'] + ", "
    + "'" + request.form['FOTO'] + "', "
    + "" + request.form['ACTIVO'] + ", "
    + "'" + request.form['EMPRESA_ID'] + "', "
    + "'" + request.form['CORREO'] + "', "
    + "sha2('" + request.form['PASSWORD'] + "', 512));"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response = {
        'exito': isinstance(last_id, int),
        'id_insertado': last_id
    }
    cur.close()
    return jsonify(response)


@app.route('/add_categoria/', methods=['POST'])
def crear_categoria():
    response = {}
    cur = mysql.connection.cursor()
    query = ("INSERT INTO CATEGORIA (NOMBRE,"
    "EMPRESA_ID) VALUES ("
    + "'" + request.form['NOMBRE'] + "', "
    + "'" + request.form['EMPRESA_ID'] + "');"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response = {
        'exito': isinstance(last_id, int),
        'id_insertado': last_id
    }
    cur.close()
    return jsonify(response)


@app.route('/add_producto/', methods=['POST'])
def crear_producto():
    response = {}
    cur = mysql.connection.cursor()
    query = ("INSERT INTO PRODUCTO (USUARIO_ID, EMPRESA_ID, NOMBRE, DESCRPCION,"
    "IMAGEN_REFERENCIA) VALUES ("
    + request.form['USUARIO_ID'] + ", "
    + request.form['EMPRESA_ID'] + ", "
    + "'" + request.form['NOMBRE'] + "', "
    + "'" + request.form['DESCRPCION'] + "', '');"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    for categoria in request.form['CATEGORIAS']:
        query = ("INSERT INTO CATEGORIA_ACTIVO (ACTIVO_ID, CATEGORIA_ID)"
        " VALUES ("
        + last_id + " "
        + categoria + " "
        ");"
        )
        cur.execute(query)
        mysql.connection.commit()
        rows = cur.fetchall()
    cur.close()
    return jsonify(response)


def count_pedidos_solcitudes():
    response = {}
    response["categorias"] = {}
    cur = mysql.connection.cursor()
    query = ("SELECT C.NOMBRE, COUNT(CA.CATEGORIA_ID) AS CONTEO FROM "
    "CATEGORIA_ACTIVO CA, CATEGORIA C, PRODUCTO P WHERE "
    " P.EMPRESA_ID = "+ + " "
    " AND CA.ACTIVO_ID = C.NOMBRE;"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    counter = 0
    for i in rows:
        response["categorias"][rows[i][0]] = rows[i][1]
        counter = counter + 1
    cur.close()
    return jsonify(response)


def detalle_articulo_inventario():
    response = {}
    response["detalles_producto"] = {}
    response["mantenimientos"] = {}
    response["consumibles"] = {}
    cur = mysql.connection.cursor()
    query = ("SELECT NOMBRE, IMAGEN_REFERENCIA FROM PRODUCTO WHERE ID = '" + request.args.get('id_producto') + "';")
    cur.execute(query)
    mysql.connection.commit()
    row = cur.fetchone()
    response["detalles_producto"] = {
        "nombre": row[0],
        "imagen": row[1]
    }
    query = ("SELECT NOMBRE, IMAGEN_REFERENCIA FROM PRODUCTO WHERE ID = '" + request.args.get('id_producto') + "';")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    response["detalles_producto"] = {
        "nombre": row[0],
        "imagen": row[1]
    }
    counter = 0
    for i in rows:
        response["categorias"][rows[i][0]] = rows[i][1]
        counter = counter + 1
    cur.close()
    return jsonify(response)


def get_mantenimientos():
    request = {}
    request["mantenimientos"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT PROVEEDOR_MTTO, COSTO, DESCRIPCION, F_INICIO, F_FINAL"
    " FROM MANTENIMIENTO WHERE INVENTARIO_ID = '" + request.args.get("id_inv")
    + "';"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    counter = 0
    for i in rows:
        query = ("SELECT RAZSOC FROM EMPRESA WHERE ID = " + i[0]
        )
        cur.execute(query)
        mysql.connection.commit()
        row = cur.fetchone()
        response["mantenimientos"][counter] = {
            "proveedor": row[0],
            "costo": i[1],
            "descripcion": i[2],
            "f_inicio": i[3],
            "f_final": i[4]
        }
        counter = counter + 1
    cur.close()
    return jsonify(request)


if __name__ == '__main__':
    app.run(debug=True, port=8888)
