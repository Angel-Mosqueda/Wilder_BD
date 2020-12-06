from flask import (Flask, jsonify, request, render_template, \
make_response, flash, url_for, send_from_directory)
from flask_mysqldb import MySQL
from werkzeug.utils import secure_filename
from utils import allowed_file
import hashlib, json, os
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLER = os.path.join(BASE_DIR, "static")
print(os.getcwd())

def create_app():
    app = Flask(
    __name__,
    template_folder='files',
    static_url_path='',
    static_folder='files'
    )

    app.config['MYSQL_HOST'] = os.getenv('BD_SERVER')
    app.config['MYSQL_USER'] = os.getenv('BD_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('BD_PASSWORD')
    app.config['MYSQL_DB'] = os.getenv('BD_BD')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLER

    return app

app = create_app()

mysql = MySQL(app)

@app.route('/static/<path:filename>') 
def send_file(filename): 
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/iniciar/', methods=['POST'])
def iniciar_sesion():
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = (
        "SELECT * FROM USUARIO WHERE CORREO = '"
        + data["EMAIL"] +
        "' AND PASSWORD = sha2('"
        + data["PASSWORD"] + "', 512);"
    )
    cur.execute(query)
    mysql.connection.commit()
    row = cur.fetchone()
    if row:
        response = make_response(json.dumps(
            {
                'exito': True,
                'desc': 'Bienvenido ' + row[1],
                'usrinfo': {
                    "id": row[0],
                    "nombre": row[1],
                    "apepat": row[2],
                    "apemat": row[3],
                    "rol": row[4],
                    "foto": row[5],
                    "activo": ord(row[6]),
                    "empresa_id": row[7],
                    "correo": row[8]
                }
            }
        ))
        response.set_cookie('logged', 'true')
        response.set_cookie('empresa', str(row[7]))
        response.set_cookie('usuario', str(row[0]))
    else:
        response = make_response(json.dumps(
            {
                'exito': False,
                'desc': 'Error en usuario o contraseña.'
            }
        ))
    cur.close()
    return response

@app.route('/cerrar_sesion/', methods=['GET'])
def cerrar_sesion():
    response = {}
    response = make_response(response)
    response.delete_cookie('usrinfo')
    response.delete_cookie('usuario')
    response.delete_cookie('empresa')
    response.delete_cookie('logged')
    return response


@app.route('/get_ok/', methods=['GET'])
def enviar_ok():
    response = {
        'status': 'ok'
    }
    
    return jsonify(response)


@app.route('/create_empresa/', methods=['POST'])
def crear_empresa():
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO EMPRESA (NOMBRE, RAZSOC) VALUES ('"
    + data['NOMBRE'] + "', '"
    + data['RAZSOC'] + "');"
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

    response["empresas"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT ID, RAZSOC FROM EMPRESA WHERE TIPO IS NULL;")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    for empresa in rows:
        response["empresas"].append({
            "id": empresa[0],
            "razon_social": empresa[1]
        })
    cur.close()
    
    return jsonify(response)


@app.route('/get_empresas/', methods=['GET'])
def obtener_empresas():
    response = {}
    response["empresas"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT ID, RAZSOC FROM EMPRESA WHERE TIPO IS NULL;")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    for empresa in rows:
        response["empresas"].append({
            "id": empresa[0],
            "razon_social": empresa[1]
        })
    cur.close()
    return response


################ INICIO REPORTES ###################
@app.route('/reporte_prestamo/', methods=['GET'])
def reporte_prestamo():
    empresa_id = int(request.cookies.get('empresa'))
    response = {}
    cur = mysql.connection.cursor()
    cur.callproc('REPORTE_PRESTAMOS', [empresa_id])
    rows = cur.fetchall()
    response["prestamos"] = []
    for prestamo in rows:
        response["prestamos"].append({
            "id": prestamo[0],
            "estado": prestamo[1],
            "usuario": prestamo[2],
            "fecha_estimada": prestamo[3],
            "fecha_regreso": prestamo[4],
            "producto": prestamo[5],
            "nserie": prestamo[6]
        })
    response["exito"] = len(response["prestamos"]) > 0
    cur.close()
    return response


@app.route('/reporte_solicitudes/', methods=['GET'])
def reporte_solicitudes():
    empresa_id = int(request.cookies.get('empresa'))
    response = {}
    cur = mysql.connection.cursor()
    cur.callproc('REPORTE_SOLICITUDES', [empresa_id])
    rows = cur.fetchall()
    response["solicitudes"] = []
    for solicitud in rows:
        response["solicitudes"].append({
            "id": solicitud[0],
            "estado": solicitud[1],
            "usuario": solicitud[2],
            "observaciones": solicitud[3],
            "fecha_creacion": solicitud[4],
            "fecha_revision": solicitud[5],
            "producto": solicitud[6],
            "nserie": solicitud[7]
        })
    response["exito"] = len(response["solicitudes"]) > 0
    cur.close()
    return response


@app.route('/reporte_mantenimientos/', methods=['GET'])
def reporte_mantenimientos():
    empresa_id = int(request.cookies.get('empresa'))
    response = {}
    cur = mysql.connection.cursor()
    cur.callproc('REPORTE_MANTENIMIENTOS', [empresa_id])
    rows = cur.fetchall()
    response["mantenimientos"] = []
    for mantenimiento in rows:
        response["mantenimientos"].append({
            "id": mantenimiento[0],
            "nserie": mantenimiento[1],
            "producto": mantenimiento[2],
            "costo": mantenimiento[3],
            "descripcion": mantenimiento[4],
            "f_inicio": mantenimiento[5],
            "f_final": mantenimiento[6]
        })
    response["exito"] = len(response["mantenimientos"]) > 0
    cur.close()
    return response


@app.route('/reportes/<tiempo>', methods=['GET'])
def reportes(tiempo):
    response = {}
    response["ubicaciones"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    cur.callproc('CONTEO_CATEGORIAS', [empresa_id])
    rows = cur.fetchall()
    response["categorias"] = []
    for conteo in rows:
        response["categorias"].append({
            "categ": conteo[0],
            "n": conteo[1]
        })
    cur.close()
    
    cur = mysql.connection.cursor()
    query = ("SELECT REPORTE_CONTEO_INCIDENCIA("
    + str(empresa_id) + ", " + str(tiempo) +
    ");")
    cur.execute(query)
    mysql.connection.commit()
    row_inc = cur.fetchone()
    cur.close()

    cur = mysql.connection.cursor()
    query = ("SELECT REPORTE_CONTEO_MTTO("
    + str(empresa_id) + ", " + str(tiempo) +
    ");")
    cur.execute(query)
    mysql.connection.commit()
    row_mtto = cur.fetchone()
    cur.close()
    
    cur = mysql.connection.cursor()
    query = ("SELECT REPORTE_CONTEO_SOLICITUD("
    + str(empresa_id) + ", " + str(tiempo) +
    ");")
    cur.execute(query)
    mysql.connection.commit()
    row_sol = cur.fetchone()
    cur.close()

    cur = mysql.connection.cursor()
    query = ("SELECT REPORTE_CONTEO_PRESTAMO("
    + str(empresa_id) + ", " + str(tiempo) +
    ");")
    cur.execute(query)
    mysql.connection.commit()
    row_prest = cur.fetchone()
    cur.close()

    response["reportes"] = {}
    response["reportes"] = {
        "incidencias": row_inc[0],
        "mantenimientos": row_mtto[0],
        "solicitudes": row_sol[0],
        "prestamos": row_prest[0]
    }

    cur = mysql.connection.cursor()
    query = ("SELECT CHART_DINERO_INV("
    + str(empresa_id) + ", " + str(tiempo) +
    ");")
    cur.execute(query)
    mysql.connection.commit()
    row_inv = cur.fetchone()
    cur.close()
    
    cur = mysql.connection.cursor()
    query = ("SELECT CHART_DINERO_MTTO("
    + str(empresa_id) + ", " + str(tiempo) +
    ");")
    cur.execute(query)
    mysql.connection.commit()
    row_mtto = cur.fetchone()
    cur.close()

    response["dinero"] = {}
    response["dinero"] = {
        "inventario": row_inv[0],
        "mantenimiento": row_mtto[0]
    }

    cur = mysql.connection.cursor()
    cur.callproc('PROVEEDORES_MTTO', [empresa_id])
    rows = cur.fetchall()
    response["principales_prov_mtto"] = []
    for conteo in rows:
        response["principales_prov_mtto"].append({
            "proveedores": conteo[0],
            "cantidad": conteo[1]
        })
    cur.close()

    cur = mysql.connection.cursor()
    cur.callproc('PROVEEDORES_INVENTARIO', [empresa_id])
    rows = cur.fetchall()
    response["principales_prov_inv"] = []
    for conteo in rows:
        response["principales_prov_inv"].append({
            "proveedores": conteo[0],
            "cantidad": conteo[1]
        })
    cur.close()
    response['exito'] = True
    return response

################ FIN REPORTES ######################

################ CRUD UBICACION ######################
@app.route('/get_ubicaciones/', methods=['GET'])
def obtener_ubicaciones():
    response = {}
    response["ubicaciones"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_UBICACIONES', [empresa_id])
    rows = cur.fetchall()
    for ubicacion in rows:
        response["ubicaciones"].append({
            "id": ubicacion[0],
            "nombre": ubicacion[1],
            "latitud": ubicacion[2],
            "longitud": ubicacion[3]
        })
    if len(response['ubicaciones']) == 0:
        response['exito'] = False
        response['desc'] = "No existen ubicaciones, intenta crear una."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_ubicacion/', methods=['POST'])
def actualizar_ubicaciones():
    response = {}
    response["ubicaciones"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE UBICACION SET NOMBRE = '" + data['NOMBRE'] +
    "', LATITUD = " + data['LATITUD'] + ", LONGITUD = " + data['LONGITUD'] +
    " WHERE ID = " + data['ID'] + ";")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_UBICACIONES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for ubicacion in rows:
        response["ubicaciones"].append({
            "id": ubicacion[0],
            "nombre": ubicacion[1],
            "latitud": ubicacion[2],
            "longitud": ubicacion[3]
        })
    cur.close()
    return response


@app.route('/delete_ubicacion/<id>', methods=['GET'])
def eliminar_ubicaciones(id):
    response = {}
    response["ubicaciones"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM UBICACION WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_UBICACIONES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for ubicacion in rows:
        response["ubicaciones"].append({
            "id": ubicacion[0],
            "nombre": ubicacion[1],
            "latitud": ubicacion[2],
            "longitud": ubicacion[3]
        })
    cur.close()
    return response


@app.route('/create_ubicacion/', methods=['POST'])
def crear_ubicaciones():
    response = {}
    response["ubicaciones"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO UBICACION (NOMBRE, LATITUD, LONGITUD, EMPRESA_ID) VALUES ('" + data['NOMBRE'] +
    "', " + data['LATITUD'] + ", "+ data['LONGITUD'] +", " + str(empresa_id) + ")")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur.callproc('GET_UBICACIONES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for ubicacion in rows:
        response["ubicaciones"].append({
            "id": ubicacion[0],
            "nombre": ubicacion[1],
            "latitud": ubicacion[2],
            "longitud": ubicacion[3]
        })
    cur.close()
    return response
################ FIN CRUD UBICACION ##################

################ CRUD PROVEEDORES ######################
@app.route('/get_proveedores/', methods=['GET'])
def obtener_proveedores():
    response = {}
    response["proveedores"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_PROVEEDORES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for proveedor in rows:
        response["proveedores"].append({
            "id": proveedor[0],
            "razsoc": proveedor[1],
            "nombre": proveedor[2]
        })
    if len(response['proveedores']) == 0:
        response['exito'] = False
        response['desc'] = "No existen proveedores, intenta crear uno."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_proveedor/', methods=['POST'])
def actualizar_proveedores():
    response = {}
    response["proveedores"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE EMPRESA SET NOMBRE = '" + data['NOMBRE'] +
    "', RAZSOC = '" + data['RAZSOC'] + "' WHERE ID = " + data['ID'] + ";")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_PROVEEDORES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for proveedor in rows:
        response["proveedores"].append({
            "id": proveedor[0],
            "razsoc": proveedor[1],
            "nombre": proveedor[2]
        })
    cur.close()
    return response


@app.route('/delete_proveedor/<id>', methods=['GET'])
def eliminar_proveedores(id):
    response = {}
    response["proveedores"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM EMPRESA WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_PROVEEDORES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for proveedor in rows:
        response["proveedores"].append({
            "id": proveedor[0],
            "razsoc": proveedor[1],
            "nombre": proveedor[2]
        })
    cur.close()
    return response


@app.route('/create_proveedor/', methods=['POST'])
def crear_proveedores():
    response = {}
    response["proveedores"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO EMPRESA (NOMBRE, RAZSOC, TIPO, EMPRESA_ID) VALUES ('" + data['NOMBRE'] +
    "', '" + data['RAZSOC'] + "', 'PROVEEDOR', " + str(empresa_id) + ")")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur.callproc('GET_PROVEEDORES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for proveedor in rows:
        response["proveedores"].append({
            "id": proveedor[0],
            "razsoc": proveedor[1],
            "nombre": proveedor[2]
        })
    cur.close()
    return response
################ FIN CRUD PROVEEDORES ##################

################### INICIO FILTRO ######################
@app.route('/filtro_consumibles', methods=['GET'])
def obtener_consumibles_f():
    response = {}
    response["consumibles"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    filtro = request.args.get('filtro')
    filtro = filtro if filtro is not None else ''

    cur.callproc('FILTRO_CONSUMIBLES', [filtro, empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for consumible in rows:
        response["consumibles"].append({
            "id": consumible[0],
            "nombre": consumible[1],
            "sku": consumible[2],
            "descripcion": consumible[3],
            "proveedor": consumible[4],
            "cantidad": consumible[5]
        })
    if len(response['consumibles']) == 0:
        response['exito'] = False
        response['desc'] = "No existen consumibles, intenta crear uno."
    else:
        response['exito'] = True
    cur.close()        
    return response

@app.route('/filtro_productos', methods=['GET'])
def obtener_productos():
    response = {}
    response["productos"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))

    categorias = request.args.get('categorias')
    filtro = request.args.get('filtro')
    categorias = categorias if categorias is not None else ''
    filtro = filtro if filtro is not None else ''

    cur.callproc('FILTRO_PRODUCTOS', [categorias, filtro, empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for producto in rows:
        response["productos"].append({
            "id": producto[0],
            "usuario_id": producto[1],
            "nombre": producto[2],
            "descripcion": producto[3],
            "imagen_referencia": producto[4]
        })
    if len(response['productos']) == 0:
        response['exito'] = False
        response['desc'] = "No existen productos, intenta crear uno."
    else:
        response['exito'] = True
    cur.close()
    return response
###################### FIN FILTRO ######################

###################### INICIO CATEGORIA ################
@app.route('/get_categorias/', methods=['GET'])
def obtener_categorias():
    response = {}
    response["categorias"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CATEGORIAS', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for categoria in rows:
        response["categorias"].append({
            "id": categoria[0],
            "nombre": categoria[1]
        })
    if len(response['categorias']) == 0:
        response['exito'] = False
        response['desc'] = "No existen categorias, intenta creando unas."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_categoria/', methods=['POST'])
def actualizar_categorias():
    response = {}
    response["categorias"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE CATEGORIA SET NOMBRE = '" + data['NOMBRE'] +
    "' WHERE ID = " + data['ID'] + ";")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CATEGORIAS', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for categoria in rows:
        response["categorias"].append({
            "id": categoria[0],
            "nombre": categoria[1]
        })
    cur.close()
    return response


@app.route('/delete_categoria/<id>', methods=['GET'])
def eliminar_categorias(id):
    response = {}
    response["categorias"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM CATEGORIA WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CATEGORIAS', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for categoria in rows:
        response["categorias"].append({
            "id": categoria[0],
            "nombre": categoria[1]
        })
    cur.close()
    return response


@app.route('/create_categoria/', methods=['POST'])
def crear_categorias():
    response = {}
    response["categorias"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO CATEGORIA (NOMBRE, EMPRESA_ID) VALUES ('" + data['NOMBRE'] +
    "', " + str(empresa_id) + ")")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur.callproc('GET_CATEGORIAS', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for categoria in rows:
        response["categorias"].append({
            "id": categoria[0],
            "nombre": categoria[1]
        })
    cur.close()
    return response
###################### FIN CATEGORIA ######################

###################### INICIO INCIDENCIA ################
@app.route('/get_incidencias/', methods=['GET'])
@app.route('/get_incidencias/<inventario_id>', methods=['GET'])
def obtener_incidencias(inventario_id = None):
    response = {}
    response["incidencias"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    if inventario_id is not None:
        query = ("SELECT I.ID, U.NOMBRE, PR.NOMBRE, INV.NSERIE, I.DESCRIPCION, I.FECHA, U.ID FROM INCIDENCIA I,"
        " INVENTARIO INV, PRODUCTO PR, USUARIO U WHERE I.ARTICULO = INV.ID AND "
        " PR.ID = INV.PRODUCTO_ID AND I.USUARIO_ID = U.ID AND I.ARTICULO = " + str(inventario_id))
    else:
        query = ("SELECT I.ID, U.NOMBRE, PR.NOMBRE, INV.NSERIE, I.DESCRIPCION, I.FECHA, U.ID FROM INCIDENCIA I,"
        " INVENTARIO INV, PRODUCTO PR, USUARIO U WHERE I.ARTICULO = INV.ID AND "
        " PR.ID = INV.PRODUCTO_ID AND I.USUARIO_ID = U.ID")

    cur.execute(query)
    mysql.connection.commit()

    rows = cur.fetchall()
    for incidencia in rows:
        response["incidencias"].append({
            "id": incidencia[0],
            "nombre": incidencia[1],
            "producto": incidencia[2],
            "nserie": incidencia[3],
            "descripcion": incidencia[4],
            "fecha": incidencia[5],
            "usrid": incidencia[6]
        })

    if len(response['incidencias']) == 0:
        response['exito'] = False
        response['desc'] = "No existen incidencias, intenta creando unas."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_incidencia/', methods=['POST'])
@app.route('/update_incidencia/<inventario_id>', methods=['POST'])
def actualizar_incidencias(inventario_id = None):
    response = {}
    response["incidencias"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE INCIDENCIA SET DESCRIPCION = '" + data['DESCRIPCION'] +
    "', FECHA = '" + data['FECHA'] + "' WHERE ID = " + data['ID'] + ";")

    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    
    cur = mysql.connection.cursor()
    if inventario_id is not None:
        query = ("SELECT I.ID, U.NOMBRE, PR.NOMBRE, INV.NSERIE, I.DESCRIPCION, I.FECHA, U.ID FROM INCIDENCIA I,"
        " INVENTARIO INV, PRODUCTO PR, USUARIO U WHERE I.ARTICULO = INV.ID AND "
        " PR.ID = INV.PRODUCTO_ID AND I.USUARIO_ID = U.ID AND I.ARTICULO = " + str(inventario_id))
    else:
        query = ("SELECT I.ID, U.NOMBRE, PR.NOMBRE, INV.NSERIE, I.DESCRIPCION, I.FECHA, U.ID FROM INCIDENCIA I,"
        " INVENTARIO INV, PRODUCTO PR, USUARIO U WHERE I.ARTICULO = INV.ID AND "
        " PR.ID = INV.PRODUCTO_ID AND I.USUARIO_ID = U.ID")
    cur.execute(query)
    mysql.connection.commit()

    rows = cur.fetchall()
    for incidencia in rows:
        response["incidencias"].append({
            "id": incidencia[0],
            "nombre": incidencia[1],
            "producto": incidencia[2],
            "nserie": incidencia[3],
            "descripcion": incidencia[4],
            "fecha": incidencia[5],
            "usrid": incidencia[6]
        })
    cur.close()
    return response


@app.route('/delete_incidencia/<id>/', methods=['GET'])
@app.route('/delete_incidencia/<id>/<inventario_id>', methods=['GET'])
def eliminar_incidencias(id, inventario_id = None):
    response = {}

    cur = mysql.connection.cursor()
    query = "DELETE FROM INCIDENCIA WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    response["exito"] = True
    cur.close()

    cur = mysql.connection.cursor()
    if inventario_id is not None:
        query = ("SELECT I.ID, U.NOMBRE, PR.NOMBRE, INV.NSERIE, I.DESCRIPCION, I.FECHA, U.ID FROM INCIDENCIA I,"
        " INVENTARIO INV, PRODUCTO PR, USUARIO U WHERE I.ARTICULO = INV.ID AND "
        " PR.ID = INV.PRODUCTO_ID AND I.USUARIO_ID = U.ID AND I.ARTICULO = " + str(inventario_id))
    else:
        query = ("SELECT I.ID, U.NOMBRE, PR.NOMBRE, INV.NSERIE, I.DESCRIPCION, I.FECHA, U.ID FROM INCIDENCIA I,"
        " INVENTARIO INV, PRODUCTO PR, USUARIO U WHERE I.ARTICULO = INV.ID AND "
        " PR.ID = INV.PRODUCTO_ID AND I.USUARIO_ID = U.ID")
    cur.execute(query)
    mysql.connection.commit()

    rows = cur.fetchall()
    response["incidencias"] = []
    for incidencia in rows:
        response["incidencias"].append({
            "id": incidencia[0],
            "nombre": incidencia[1],
            "producto": incidencia[2],
            "nserie": incidencia[3],
            "descripcion": incidencia[4],
            "fecha": incidencia[5],
            "usrid": incidencia[6]
        })
    cur.close()
    return response


@app.route('/create_incidencia/<producto_id>', methods=['POST'])
def crear_incidencias(producto_id):
    response = {}
    response["incidencias"] = []
    usuario_id = int(request.cookies.get('usuario'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO INCIDENCIA (USUARIO_ID, ARTICULO, DESCRIPCION, FECHA) VALUES ("
       + str(usuario_id) + ", "
       + str(producto_id) + ", "
       + "'" + data['DESCRIPCION'] + "', "
       + "'" + str(data['FECHA']) + "' "
    ");")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur = mysql.connection.cursor()
    query = ("SELECT I.ID, U.NOMBRE, PR.NOMBRE, INV.NSERIE, I.DESCRIPCION, I.FECHA, U.ID FROM INCIDENCIA I,"
        " INVENTARIO INV, PRODUCTO PR, USUARIO U WHERE I.ARTICULO = INV.ID AND "
        " PR.ID = INV.PRODUCTO_ID AND I.USUARIO_ID = U.ID AND I.ARTICULO = " + str(inventario_id))
    cur.execute(query)
    mysql.connection.commit()

    rows = cur.fetchall()
    for incidencia in rows:
        response["incidencias"].append({
            "id": incidencia[0],
            "nombre": incidencia[1],
            "producto": incidencia[2],
            "nserie": incidencia[3],
            "descripcion": incidencia[4],
            "fecha": incidencia[5]
        })
    cur.close()
    return response
###################### FIN INCIDENCIA ######################

######################### INICIO CONSUMIBLE ###############
@app.route('/get_consumibles/', methods=['GET'])
def obtener_consumibles():
    response = {}
    response["consumibles"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CONSUMIBLES', [empresa_id])
    rows = cur.fetchall()
    for consumible in rows:
        response["consumibles"].append({
            "id": consumible[0],
            "nombre": consumible[1],
            "sku": consumible[2],
            "cantidad": consumible[3],
            "descripcion": consumible[4],
            "proveedor": consumible[5],
            "empresa_id": consumible[6]
        })
    if len(response['consumibles']) == 0:
        response['exito'] = False
        response['desc'] = "No existen consumibles, intenta crear alguno."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_consumible/', methods=['POST'])
def actualizar_consumibles():
    response = {}
    response["consumibles"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("UPDATE CONSUMIBLE SET NOMBRE = '" + data['NOMBRE'] +
    "', cantidad = "+ data["CANTIDAD"] +", sku = '" + data["SKU"] + "',"
    " descripcion = '" + data["DESCRIPCION"] + "'"
    " WHERE ID = " + data['ID'] + ";")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CONSUMIBLES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for consumible in rows:
        response["consumibles"].append({
            "id": consumible[0],
            "nombre": consumible[1],
            "sku": consumible[2],
            "cantidad": consumible[3],
            "descripcion": consumible[4],
            "proveedor": consumible[5],
            "empresa_id": consumible[6]
        })
    cur.close()
    return response


@app.route('/delete_consumible/<id>', methods=['GET'])
def eliminar_consumibles(id):
    response = {}
    response["consumibles"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM CONSUMIBLE WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    cur.callproc('GET_CONSUMIBLES', [empresa_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for consumible in rows:
        response["consumibles"].append({
            "id": consumible[0],
            "nombre": consumible[1],
            "sku": consumible[2],
            "cantidad": consumible[3],
            "descripcion": consumible[4],
            "proveedor": consumible[5],
            "empresa_id": consumible[6]
        })
    cur.close()
    return response


@app.route('/create_consumible/', methods=['POST'])
def crear_consumibles():
    response = {}
    response["consumibles"] = []
    empresa_id = int(request.cookies.get('empresa'))

    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    query = ("INSERT INTO CONSUMIBLE (CANTIDAD, SKU, NOMBRE, DESCRIPCION, EMPRESA_ID, PROVEEDOR) VALUES"
    " ('" + str(data['CANTIDAD']) + "', '" + data['SKU'] + "', '" + data['NOMBRE'] + "', '" + str(data['DESCRIPCION']) + "', " + str(empresa_id) +
    ", " + str(data['PROVEEDOR']) + ")")
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)

    cur.close()
    return response
######################### FIN CONSUMIBLE #####################

######################### INICIO USUARIO #####################
@app.route('/get_usuarios/', methods=['GET'])
def obtener_usuarios():
    response = {}
    response["usuarios"] = []
    cur = mysql.connection.cursor()
    empresa_id = int(request.cookies.get('empresa'))
    usuario_id = request.cookies.get('usuario')
    cur.callproc('GET_USUARIOS', [empresa_id, usuario_id])
    rows = cur.fetchall()
    for usuario in rows:
        response["usuarios"].append({
            "id": usuario[0],
            "nombre": usuario[1],
            "apepat": usuario[2],
            "apemat": usuario[3],
            "correo": usuario[4],
            "rol": usuario[5],
            "foto": usuario[6],
            "activo": ord(usuario[7])
        })
    if len(response['usuarios']) == 0:
        response['exito'] = False
        response['desc'] = "No existen usuarios, intenta crear alguno."
    else:
        response['exito'] = True
    cur.close()
    return response


@app.route('/update_usuario/', methods=['POST'])
def actualizar_usuarios():
    response = {}
    response["usuarios"] = []
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    empresa_id = int(request.cookies.get('empresa'))
    usuario_id = request.cookies.get('usuario')
    query = (
        "UPDATE USUARIO SET "
        "NOMBRE ='" + data['NOMBRE'] + "',"
        "APEPAT ='" + data['APEPAT'] + "',"
        "APEMAT ='" + data['APEMAT'] + "',"
        # "CORREO =" + data['NOMBRE'] + ","
        "ROL =" + str(data['ROL']) + ","
        "ACTIVO =" + str(data['ACTIVO']) + " WHERE "
        "ID = " + data['ID'] + " AND "
        "EMPRESA_ID = " + str(empresa_id)
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    cur.callproc('GET_USUARIOS', [empresa_id, usuario_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for usuario in rows:
        response["usuarios"].append({
            "id": usuario[0],
            "nombre": usuario[1],
            "apepat": usuario[2],
            "apemat": usuario[3],
            "correo": usuario[4],
            "rol": usuario[5],
            "foto": usuario[6],
            "activo": ord(usuario[7])
        })
    cur.close()
    return response


@app.route('/delete_usuario/<id>', methods=['GET'])
def eliminar_usuarios(id):
    response = {}
    response["usuarios"] = []
    cur = mysql.connection.cursor()
    query = "DELETE FROM USUARIO WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()

    empresa_id = int(request.cookies.get('empresa'))
    usuario_id = request.cookies.get('usuario')
    
    cur.callproc('GET_USUARIOS', [empresa_id, usuario_id])
    # mysql.connection.commit()
    rows = cur.fetchall()
    for usuario in rows:
        response["usuarios"].append({
            "id": usuario[0],
            "nombre": usuario[1],
            "apepat": usuario[2],
            "apemat": usuario[3],
            "correo": usuario[4],
            "rol": usuario[5],
            "foto": usuario[6],
            "activo": ord(usuario[7])
        })
    cur.close()
    return response

@app.route('/add_user/', methods=['POST'])
def crear_usuario():
    response = {}
    cur = mysql.connection.cursor()
    try:
        data = json.loads(request.data)
    except:
        data = json.loads(request.form['datos'])
    empresa_id = request.cookies.get('empresa') if request.cookies.get('empresa') is not None else data['EMPRESA_ID']
    arch = request.files['file']
    if not allowed_file(arch.filename):
        response['exito'] = False
        response['desc'] = "Sube un archivo de los permitidos"
        return response
    filename = secure_filename(str(int(datetime.now().timestamp())) + arch.filename)

    arch.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    query = ("INSERT INTO USUARIO (NOMBRE, APEPAT, APEMAT, ROL,"
    "FOTO, ACTIVO, EMPRESA_ID, CORREO, PASSWORD) VALUES ("
    + "'" + data['NOMBRE'] + "', "
    + "'" + data['APEPAT'] + "', "
    + "'" + data['APEMAT'] + "', "
    + "" + str(data['ROL']) + ", "
    + "'" + filename + "', "
    + "1, "
    + "'" + str(empresa_id) + "', "
    + "'" + data['CORREO'] + "', "
    + "sha2('" + data['PASSWORD'] + "', 512));"
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

######################### FIN USUARIO #####################

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

################### INICIO PROD ######################
@app.route('/add_producto/', methods=['POST'])
def crear_producto():
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.form['datos'])
    arch = request.files['file']
    if not allowed_file(arch.filename):
        response['exito'] = False
        response['desc'] = "Sube un archivo de los permitidos"
        return response
    filename = secure_filename(str(int(datetime.now().timestamp())) + arch.filename)
    # filename = (str(int(datetime.now().timestamp())) + filename)
    arch.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    empresa_id = request.cookies.get('empresa')
    usuario_id = request.cookies.get('usuario')
    query = ("INSERT INTO PRODUCTO (USUARIO_ID, EMPRESA_ID, NOMBRE, DESCRIPCION,"
    "IMAGEN_REFERENCIA) VALUES ("
    + str(usuario_id) + ", "
    + str(empresa_id) + ", "
    + "\"" + data['NOMBRE'] + "\", "
    + "'" + data['DESCRIPCION'] + "', '" + filename + "')"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    for categoria in data['CATEGORIAS'][2:]:
        query = ("INSERT INTO categoria_producto (PRODUCTO_ID, CATEGORIA_ID)"
        " VALUES ("
        + str(last_id) + ","
        + categoria +
        ");"
        )
        cur.execute(query)
        mysql.connection.commit()
        rows = cur.fetchall()
    cur.close()
    return jsonify(response)


@app.route('/get_producto/<producto_id>', methods=['GET'])
def obtener_producto(producto_id):
    response = {}
    cur = mysql.connection.cursor()
    empresa_id = request.cookies.get('empresa')
    cur.callproc('GET_PRODUCTO', [producto_id, empresa_id])
    row = cur.fetchone()
    cur.close()
    if row:
        cur = mysql.connection.cursor()
        response['exito'] = True
        response['producto'] = {
            'id': row[0],
            'usr': row[1],
            'nombre': row[2],
            'desc': row[3],
            'imagen_referencia': row[4]
        }
        cur.callproc('GET_PRODUCTO_CATEG', [producto_id])
        rows = cur.fetchall()
        response['categorias'] = []
        for categ in rows:
            response['categorias'].append({
                'nombre': categ[0]
            })
        cur.close()
        cur = mysql.connection.cursor()
        query = ("SELECT * FROM ARMAR_INVENTARIO WHERE PRODUCTO_ID = " + str(producto_id))
        cur.execute(query)
        mysql.connection.commit()
        rows = cur.fetchall()
        response['inventario'] = []
        if len(rows) > 0:
            for inv in rows:
                response['inventario'].append({
                    'id': inv[1],
                    'serie': inv[2],
                    'folio': inv[3],
                    'unombre': inv[4],
                    'lat': inv[5],
                    'lon': inv[6],
                    'costo': inv[7],
                    'estado': inv[8],
                    'observaciones': inv[9],
                    'proveedor': inv[10],
                    'f_compra': inv[11],
                    'archivo_fac': inv[12]
                })
        cur.close()
    else:
        response['exito'] = False
        response['desc'] = "Dicho producto no existe."
    return jsonify(response)

################### FIN PROD ######################

################### INICIO INV ####################
@app.route('/add_inventario/<id_producto>', methods=['POST'])
def crear_inventario(id_producto):
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.form['datos'])
    arch = request.files['file']
    if not allowed_file(arch.filename):
        response['exito'] = False
        response['desc'] = "Sube un archivo de los permitidos"
        return response
    filename = secure_filename(str(int(datetime.now().timestamp())) + arch.filename)
    # filename = (str(int(datetime.now().timestamp())) + filename)
    arch.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    empresa_id = request.cookies.get('empresa')
    query = ("INSERT INTO INVENTARIO (PRODUCTO_ID, NSERIE, NFACTURA, UBICACION_ID, COSTO,"
    "ESTADO, OBSERVACIONES, PROVEEDOR, FECHA_COMPRA, FACTURA) VALUES ("
    + str(id_producto) + ", "
    "'"+ data['NSERIE'] + "', "
    "'"+ data['NFACTURA'] + "', "
    + data['UBICACION_ID'] + ", "
    + str(data['COSTO']) + ", "
    + data['ESTADO'] + ", "
    "'"+ data['OBSERVACIONES'] + "', "
    + data['PROVEEDOR'] + ", "
    "'"+ data['FECHA_COMPRA'] + "', "
    "'"+ filename + "'"
    ");"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response['exito'] = isinstance(last_id, int)
    cur.close()
    cur = mysql.connection.cursor()
    query = ("SELECT * FROM ARMAR_INVENTARIO WHERE PRODUCTO_ID = " + str(id_producto))
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    response['inventario'] = []
    if len(rows) > 0:
        for inv in rows:
            response['inventario'].append({
                'id': inv[1],
                'serie': inv[2],
                'folio': inv[3],
                'unombre': inv[4],
                'lat': inv[5],
                'lon': inv[6],
                'costo': inv[7],
                'estado': inv[8],
                'observaciones': inv[9],
                'proveedor': inv[10],
                'f_compra': inv[11],
                'archivo_fac': inv[12]
            })
    cur.close()
    return jsonify(response)
################### FIN INV #######################

################## INC MANTENIMIENTO###############
@app.route('/get_mantenimientos/<id_producto>', methods=['GET'])
def get_mantenimientos(id_producto):
    response = {}
    response["mantenimientos"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT M.ID, P.RAZSOC, M.COSTO, M.DESCRIPCION, M.F_INICIO, M.F_FINAL"
    " FROM MANTENIMIENTO M, EMPRESA P WHERE M.PROVEEDOR_MTTO = P.ID AND INVENTARIO_ID = '" + str(id_producto)
    + "';"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    counter = 0
    for mtto in rows:
        response["mantenimientos"].append({
            'id': mtto[0],
            'proveedor': mtto[1],
            'costo': mtto[2],
            'descripcion': mtto[3],
            'f_inicio': mtto[4],
            'f_final': mtto[5]
        })
    if len(response['mantenimientos']) == 0:
        response['exito'] = False
        response['desc'] = "No existen mantenimientos."
    else:
        response['exito'] = True
    cur.close()
    return jsonify(response)

@app.route('/create_mantenimiento/<id_producto>', methods=['POST'])
def crear_mantenimiento(id_producto):
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    F_FINAL = ' F_FINAL = NULL ' if data['F_FINAL'] == '' else " F_FINAL = '" + str(data['F_FINAL']) + "' "
    query = ("INSERT INTO MANTENIMIENTO (INVENTARIO_ID, COSTO, DESCRIPCION, PROVEEDOR_MTTO, F_INICIO, F_FINAL) VALUES ("
    + str(id_producto) + ", "
    + str(data['COSTO']) + ", "
    "'" + data['DESCRIPCION'] + "', "
    + str(data['PROVEEDOR']) + ", "
    "'" + str(data['F_INICIO']) + "', " + F_FINAL +
    ");"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response = {
        'exito': isinstance(last_id, int),
        'id_insertado': last_id
    }

    response["mantenimientos"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT M.ID, P.RAZSOC, M.COSTO, M.DESCRIPCION, M.F_INICIO, M.F_FINAL"
    " FROM MANTENIMIENTO M, EMPRESA P WHERE M.PROVEEDOR_MTTO = P.ID AND INVENTARIO_ID = '" + str(id_producto)
    + "';"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    counter = 0
    for mtto in rows:
        response["mantenimientos"].append({
            'id': mtto[0],
            'proveedor': mtto[1],
            'costo': mtto[2],
            'descripcion': mtto[3],
            'f_inicio': mtto[4],
            'f_final': mtto[5]
        })
    cur.close()
    return jsonify(response)


@app.route('/delete_mantenimiento/<id>/<id_producto>', methods=['GET'])
def eliminar_mantenimientos(id, id_producto):
    response = {}
    cur = mysql.connection.cursor()
    query = "DELETE FROM MANTENIMIENTO WHERE ID = " + str(id) + ";"
    
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    cur.close()

    empresa_id = int(request.cookies.get('empresa'))
    response["mantenimientos"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT M.ID, P.RAZSOC, M.COSTO, M.DESCRIPCION, M.F_INICIO, M.F_FINAL"
    " FROM MANTENIMIENTO M, EMPRESA P WHERE M.PROVEEDOR_MTTO = P.ID AND INVENTARIO_ID = '" + str(id_producto)
    + "';"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    counter = 0
    for mtto in rows:
        response["mantenimientos"].append({
            'id': mtto[0],
            'proveedor': mtto[1],
            'costo': mtto[2],
            'descripcion': mtto[3],
            'f_inicio': mtto[4],
            'f_final': mtto[5]
        })
    cur.close()
    return jsonify(response)
    return response


@app.route('/update_mantenimiento/<id_producto>', methods=['POST'])
def actualizar_mantenimiento(id_producto):
    response = {}
    cur = mysql.connection.cursor()
    data = json.loads(request.data)
    F_INICIO = ' F_INICIO = NULL, ' if data['F_INICIO'] == '' else " F_INICIO = '" + str(data['F_INICIO']) + "', "
    F_FINAL = ' F_FINAL = NULL ' if data['F_FINAL'] == '' else " F_FINAL = '" + str(data['F_FINAL']) + "' "
    query = ("UPDATE MANTENIMIENTO SET"
    " COSTO = " + str(data['COSTO']) + ", "
    " DESCRIPCION = '" + str(data['DESCRIPCION']) + "', "
    + F_INICIO + " " + F_FINAL +
    " WHERE ID = " + str(data['ID']) + ";"
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

    response["mantenimientos"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT M.ID, P.RAZSOC, M.COSTO, M.DESCRIPCION, M.F_INICIO, M.F_FINAL"
    " FROM MANTENIMIENTO M, EMPRESA P WHERE M.PROVEEDOR_MTTO = P.ID AND INVENTARIO_ID = '" + str(id_producto)
    + "';"
    )
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    counter = 0
    for mtto in rows:
        response["mantenimientos"].append({
            'id': mtto[0],
            'proveedor': mtto[1],
            'costo': mtto[2],
            'descripcion': mtto[3],
            'f_inicio': mtto[4],
            'f_final': mtto[5]
        })
    cur.close()
    return response
##################### FIN MANTENIMIENTO ###################   


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

##############AGREGAR SOLICITUDES#################
@app.route('/add_solicitud/', methods=['POST'])
def crear_solicitud():
    response = {}
    data = json.loads(request.data)
    cur = mysql.connection.cursor()
    query = ("INSERT INTO SOLICITUD (FECHA_CREACION"
    ",ESTADO,SOLICITANTE,INVENTARIO_ID) VALUES (" 
    +"now(),"
    + " '" + str(data['ESTADO_SOLICITUD']) 
    + "', " + str(data['USUARIO_ID']) 
    + ", " + str(data['INVENTARIO_ID']) + ");")
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


###################   AGREGAR SOLICITUDES PARTE 2   #####################
@app.route('/add_solicitudP2/<id_revpor>+<id_solicitud>', methods=['GET'])
def crear_solicitudP2(id_revpor, id_solicitud):
    response = {}
    cur = mysql.connection.cursor()
    query = ("UPDATE SOLICITUD SET REVISADO_POR = " + str(id_revpor) +", FECHA_REVISION = NOW() "
    ", ESTADO = '1' WHERE ID = " + str(id_solicitud) +";" )
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


###################   AGREGAR SOLICITUDES PARTE 3   #####################
@app.route('/add_solicitudP3/<observaciones>+<id_solicitud>', methods=['GET'])
def crear_solicitudP3(observaciones, id_solicitud):
    response = {}
    cur = mysql.connection.cursor()
    query = ("UPDATE SOLICITUD SET OBSERVACIONES = '" + str(observaciones) +"', "
    "ESTADO = '0' WHERE ID = " + str(id_solicitud) +";" )
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





###################   ACTUALIZAR PRODUCTO   #####################
@app.route('/upp_prestamo/<id_prestamo>', methods=['GET'])
def update_prestamo(id_prestamo):
    response = {}
    cur = mysql.connection.cursor()
    query = ("UPDATE PRESTAMO SET FECHA_REGRESO = NOW(), "
    "ESTADO = '0' WHERE ID = " + str(id_prestamo) +";" )
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


#########################################################################


@app.route('/get_solicitudes/', methods=['GET'])
def obtener_solicitudes():
    response = {}
    response["solicitud"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT S.ID, S.ESTADO, S.SOLICITANTE, S.FECHA_CREACION, S.INVENTARIO_ID, U.NOMBRE, U.APEPAT, P.NOMBRE, "
    " I.NSERIE, I.ID FROM SOLICITUD S, USUARIO U, PRODUCTO P, INVENTARIO I  WHERE S.SOLICITANTE = U.ID AND "
    " I.ID = S.INVENTARIO_ID AND P.ID = I.PRODUCTO_ID AND S.ESTADO = '4';")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    for solicitud in rows:
        response["solicitud"].append({
            "sol_id": solicitud[0],
            "sol_estado": solicitud[1],
            "sol_solicitante": solicitud[2],
            "sol_fecha_creacion": solicitud[3],
            "sol_inventario_id": solicitud[4],
            "usr_nombre": solicitud[5],
            "usr_apepat": solicitud[6],
            "prod_nombre": solicitud[7],
            "inv_nserie": solicitud[8],
            "inv_id": solicitud[9]
        })
    cur.close()
    return response



@app.route('/get_prod_sin_sol/', methods=['GET'])
def obtener_productos_sin_sol():
    response = {}
    response["productos"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT I.ID, I.NSERIE, P.ID, P.NOMBRE, P.IMAGEN_REFERENCIA FROM INVENTARIO I, PRODUCTO P WHERE I.PRODUCTO_ID=P.ID AND I.ESTADO = 0;")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    for producto in rows:
        response["productos"].append({
            "inv_id": producto[0],
            "inv_nserie": producto[1],
            "prod_id": producto[2],
            "prod_nombre": producto[3],
            "prod_imagen_referencia": producto[4]
        })
    cur.close()
    return response


@app.route('/upp_estado/<id_producto>+<val_estado>', methods=['GET'])
def update_estado(id_producto,val_estado):
    response = {}
    cur = mysql.connection.cursor()
    query = "UPDATE INVENTARIO SET ESTADO = " + str(val_estado) + " WHERE ID = " + str(id_producto) + ";"
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    last_id = cur.lastrowid
    response = {
        'exito': isinstance(last_id, int),
        'id_insertado': last_id
    }
    cur.close()
    return response

@app.route('/add_prestamo/', methods=['POST'])
def crear_prestamo():
    response = {}
    data = json.loads(request.data)
    cur = mysql.connection.cursor()
    query = ("INSERT INTO PRESTAMO (ESTADO, SOLICITANTE"
    ", PRESTADOR,FECHA_ESTIMADA,INVENTARIO_ID) VALUES (" 
    + " '" + str(data['ESTADO'])
    + "', " + str(data['SOLICITANTE']) 
    + ", " + str(data['PRESTADOR']) 
    + ", '" + str(data['FECHA_ESTIMADA']) 
    + "', " + str(data['INVENTARIO_ID']) + ");")
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



@app.route('/get_prestamos/', methods=['GET'])
def obtener_prestamos():
    response = {}
    response["prestamos"] = []
    cur = mysql.connection.cursor()
    query = ("SELECT PREST.ID, U.NOMBRE, U.APEPAT, PROD.NOMBRE, S.FECHA_REVISION, S.ID, "
    "I.NSERIE, I.ID FROM PRESTAMO PREST, INVENTARIO I, PRODUCTO PROD, USUARIO U, SOLICITUD S "
    "WHERE I.PRODUCTO_ID = PROD.ID AND I.ESTADO = 1 AND U.ID = PREST.SOLICITANTE AND "
    "S.INVENTARIO_ID = I.ID AND PREST.INVENTARIO_ID = I.ID AND S.SOLICITANTE = U.ID "
    "AND S.INVENTARIO_ID = PREST.INVENTARIO_ID AND PREST.ESTADO = '1' AND S.ESTADO = '1';")
    cur.execute(query)
    mysql.connection.commit()
    rows = cur.fetchall()
    for prestamos in rows:
        response["prestamos"].append({
            "prest_id": prestamos[0],
            "usr_nombre": prestamos[1],
            "usr_apepat": prestamos[2],
            "prod_nombre": prestamos[3],
            "sol_fecha_revision": prestamos[4],
            "sol_id": prestamos[5],
            "inv_nserie": prestamos[6],
            "inv_id": prestamos[7]
        })
    cur.close()
    return response


@app.errorhandler(404) 
def not_found(e):
    return render_template("index.html") 


@app.route('/')
def angular_root():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, threaded=True, port=8888)
