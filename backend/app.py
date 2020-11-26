from flask import Flask, jsonify, request, render_template
from flask_mysqldb import MySQL
import hashlib, json

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


@app.route('/iniciar/', methods=['POST'])
def iniciar_sesion():
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = (
        "SELECT NOMBRE, EMPRESA_ID, ID FROM USUARIO WHERE CORREO = '"
        + data["EMAIL"] +
        "' AND PASSWORD = sha2('"
        + data["PASSWORD"] + "', 512);"
    )
    cur.execute(query)
    mysql.connection.commit()
    row = cur.fetchone()
    if row:
        request.cookies.set('logged', True)
        request.cookies.set('empresa', row[1])
        request.cookies.set('usario', row[2])
        response = {
            'exito': True,
            'desc': 'Bienvenido ' + row[0]
        }
    else:
        response = {
            'exito': False,
            'desc': 'Error en usuario o contraseña.'
        }
    return response


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


@app.route('/get_empresas/', methods=['GET'])
def obtener_empresas():
    response = {}
    response["empresas"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT ID, RAZSOC FROM EMPRESA;")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    for empresa in rows:
        response["empresas"].append({
            "id": empresa[0],
            "razon_social": empresa[1]
        })
    return response


@app.route('/add_user/', methods=['POST'])
def crear_usuario():
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO USUARIO (NOMBRE, APEPAT, APEMAT, ROL,"
    "FOTO, ACTIVO, EMPRESA_ID, CORREO, PASSWORD) VALUES ("
    + "'" + data['NOMBRE'] + "', "
    + "'" + data['APEPAT'] + "', "
    + "'" + data['APEMAT'] + "', "
    + "" + str(data['ROL']) + ", "
    + "'" + data['FOTO'] + "', "
    + "1, "
    + "'" + data['EMPRESA_ID'] + "', "
    + "'" + data['CORREO'] + "', "
    + "sha2('" + data['PASSWORD'] + "', 512));"
    )
    import pdb; pdb.set_trace()
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


@app.route('/')
def angular_root():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, port=8888)
