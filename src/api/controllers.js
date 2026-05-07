export const CONTROLLERS = {
  Investigaciones: {
    title: 'Investigaciones',
    description:
      'CRUD básico (Lista / Por código / Crear / Actualizar / Eliminar).',
    endpoints: [
      { id: 'list', name: 'Lista', method: 'GET', path: '/api/Investigaciones/Lista' },
      {
        id: 'get',
        name: 'Por código',
        method: 'GET',
        path: '/api/Investigaciones/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código' }],
      },
      {
        id: 'create',
        name: 'Crear',
        method: 'POST',
        path: '/api/Investigaciones/Crear',
        bodySchema: {
          Codigo: '',
          Titulo: '',
          TipoEstudio: '',
          Fase: '',
          FechaInicio: '2026-01-01',
          FechaFin: '2026-12-31',
        },
      },
      {
        id: 'update',
        name: 'Actualizar',
        method: 'PUT',
        path: '/api/Investigaciones/Actualizar/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código (URL)' }],
        bodySchema: {
          Codigo: '',
          Titulo: '',
          TipoEstudio: '',
          Fase: '',
          FechaInicio: '2026-01-01',
          FechaFin: '2026-12-31',
        },
      },
      {
        id: 'delete',
        name: 'Eliminar',
        method: 'DELETE',
        path: '/api/Investigaciones/Eliminar/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código' }],
      },
    ],
  },

  Recolecciones: {
    title: 'Recolecciones',
    description: 'CRUD básico + algunos GET extra.',
    endpoints: [
      { id: 'list', name: 'Lista', method: 'GET', path: '/api/Recolecciones/Lista' },
      {
        id: 'get',
        name: 'Por código',
        method: 'GET',
        path: '/api/Recolecciones/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código' }],
      },
      {
        id: 'create',
        name: 'Crear',
        method: 'POST',
        path: '/api/Recolecciones/Crear',
        bodySchema: {
          Codigo: '',
          CodigoProtocolo: '',
          FechaInicio: '2026-01-01',
          Fechafin: '2026-01-02',
          Descripcion: '',
          Total: 0,
        },
      },
      {
        id: 'update',
        name: 'Actualizar',
        method: 'PUT',
        path: '/api/Recolecciones/Actualizar/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código (URL)' }],
        bodySchema: {
          Codigo: '',
          CodigoProtocolo: '',
          FechaInicio: '2026-01-01',
          Fechafin: '2026-01-02',
          Descripcion: '',
          Total: 0,
        },
      },
      {
        id: 'delete',
        name: 'Eliminar',
        method: 'DELETE',
        path: '/api/Recolecciones/Eliminar/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código' }],
      },
      {
        id: 'getResultadosARecoleccion',
        name: 'Resultados a Recolección',
        method: 'GET',
        path: '/api/Recolecciones/ResultadosARecoleccion/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código Recolección' }],
      },
      {
        id: 'getAnormales',
        name: 'Resultados anormales',
        method: 'GET',
        path: '/api/Recolecciones/ResultadosAnormales',
      },
    ],
  },

  Resultados: {
    title: 'Resultados',
    description: 'CRUD básico + varios GET por filtros.',
    endpoints: [
      { id: 'list', name: 'Lista', method: 'GET', path: '/api/Resultados/Lista' },
      {
        id: 'get',
        name: 'Por código',
        method: 'GET',
        path: '/api/Resultados/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código' }],
      },
      {
        id: 'create',
        name: 'Crear',
        method: 'POST',
        path: '/api/Resultados/Crear',
        bodySchema: {
          Codigo: '',
          CodigoOrdenLaboratorio: '',
          CodigoPaciente: '',
          TipoPrueba: '',
          ValorObtenido: '',
          FechaRecepcion: '2026-01-01',
          TieneValorAnormal: 'no',
        },
      },
      {
        id: 'update',
        name: 'Editar',
        method: 'PUT',
        path: '/api/Resultados/EditarResultado/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código (URL)' }],
        bodySchema: {
          Codigo: '',
          CodigoOrdenLaboratorio: '',
          CodigoPaciente: '',
          TipoPrueba: '',
          ValorObtenido: '',
          FechaRecepcion: '2026-01-01',
          TieneValorAnormal: 'no',
        },
      },
      {
        id: 'delete',
        name: 'Eliminar',
        method: 'DELETE',
        path: '/api/Resultados/Eliminar/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código' }],
      },
      {
        id: 'porPaciente',
        name: 'Por paciente',
        method: 'GET',
        path: '/api/Resultados/8.PorPaciente/{codigoPaciente}',
        pathParams: [{ key: 'codigoPaciente', label: 'Código Paciente' }],
      },
      {
        id: 'anormalesPorPaciente',
        name: 'Anormales por paciente',
        method: 'GET',
        path: '/api/Resultados/AnormalesPorPaciente/{codigoPaciente}',
        pathParams: [{ key: 'codigoPaciente', label: 'Código Paciente' }],
      },
    ],
  },

  TipoSintomas: {
    title: 'Tipo Síntomas',
    description: 'CRUD básico.',
    endpoints: [
      { id: 'list', name: 'Lista', method: 'GET', path: '/api/TipoSintomas/Lista' },
      {
        id: 'get',
        name: 'Por código',
        method: 'GET',
        path: '/api/TipoSintomas/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código' }],
      },
      {
        id: 'create',
        name: 'Crear',
        method: 'POST',
        path: '/api/TipoSintomas/Crear',
        bodySchema: { Codigo: '', Nombre: '', Gravedad: '' },
      },
      {
        id: 'update',
        name: 'Actualizar',
        method: 'PUT',
        path: '/api/TipoSintomas/Actualizar/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código (URL)' }],
        bodySchema: { Codigo: '', Nombre: '', Gravedad: '' },
      },
      {
        id: 'delete',
        name: 'Eliminar',
        method: 'DELETE',
        path: '/api/TipoSintomas/Eliminar/{codigo}',
        pathParams: [{ key: 'codigo', label: 'Código' }],
      },
    ],
  },

  ResultadoSintomas: {
    title: 'Resultado Síntomas',
    description: 'CRUD con clave compuesta (resultado + tipo síntoma).',
    endpoints: [
      { id: 'list', name: 'Lista', method: 'GET', path: '/api/Resultado_Sintomas/Lista' },
      {
        id: 'get',
        name: 'Buscar',
        method: 'GET',
        path: '/api/Resultado_Sintomas/{codigoResultado}/{codigoTipoSintoma}',
        pathParams: [
          { key: 'codigoResultado', label: 'Código Resultado' },
          { key: 'codigoTipoSintoma', label: 'Código TipoSíntoma' },
        ],
      },
      {
        id: 'create',
        name: 'Crear',
        method: 'POST',
        path: '/api/Resultado_Sintomas/Crear',
        bodySchema: { CodigoResultado: '', CodigoTipoSintoma: '' },
      },
      {
        id: 'update',
        name: 'Actualizar',
        method: 'PUT',
        path: '/api/Resultado_Sintomas/Actualizar/{codigoResultado}/{codigoTipoSintoma}',
        pathParams: [
          { key: 'codigoResultado', label: 'Código Resultado (URL)' },
          { key: 'codigoTipoSintoma', label: 'Código TipoSíntoma (URL)' },
        ],
        bodySchema: { CodigoResultado: '', CodigoTipoSintoma: '' },
      },
      {
        id: 'delete',
        name: 'Eliminar',
        method: 'DELETE',
        path: '/api/Resultado_Sintomas/Eliminar/{codigoResultado}/{codigoTipoSintoma}',
        pathParams: [
          { key: 'codigoResultado', label: 'Código Resultado' },
          { key: 'codigoTipoSintoma', label: 'Código TipoSíntoma' },
        ],
      },
    ],
  },

  Farmacia: {
    title: 'Farmacia (microservicio)',
    description: 'Consume servicio externo de farmacia.',
    endpoints: [
      { id: 'meds', name: 'Listar medicamentos', method: 'GET', path: '/api/Farmacia/ListarMedicamentos' },
      {
        id: 'receta',
        name: 'Crear receta',
        method: 'POST',
        path: '/api/Farmacia/CrearReceta',
        ui: 'farmaciaReceta',
        bodySchema: {
          pacienteCodigo: '',
          medicoCodigo: '',
          detalles: [
            {
              medicamentoCodigo: '',
              cantidadSolicitada: 0,
              posologia: {
                dosis: 0,
                unidadAbreviatura: '',
                viaAdministracion: '',
                frecuencia: '',
                frecuenciaValor: 0,
                duracion: '',
                indicacionesAdicionales: '',
              },
            },
          ],
        },
      },
    ],
  },

  OrdenLaboratorio: {
    title: 'Orden Laboratorio (microservicio)',
    description: 'Consume servicio externo de diagnósticos.',
    endpoints: [
      {
        id: 'examenes',
        name: 'Listar exámenes',
        method: 'GET',
        path: '/api/OrdenLaboratorio/ListarExamenes',
        uiResult: 'ordenExamenes',
      },
      {
        id: 'porDoctor',
        name: 'Orden por doctor',
        method: 'GET',
        path: '/api/OrdenLaboratorio/ObtenerOrdenPorDoctor/{code}',
        pathParams: [{ key: 'code', label: 'Médico (CI)', optionsFrom: 'medicos' }],
        uiResult: 'ordenPorDoctor',
      },
      {
        id: 'crearOrden',
        name: 'Crear orden',
        method: 'POST',
        path: '/api/OrdenLaboratorio/CrearOrden',
        ui: 'ordenCrear',
        bodySchema: {
          code: '',
          PacienteCodigo: '',
          MedicoCodigo: '',
          FechaOrden: '2026-01-01',
          TipoAtencion: '',
          Observaciones: '',
        },
      },
    ],
  },

  Bioseguridad: {
    title: 'Bioseguridad (microservicio)',
    description: 'Endpoints de bioseguridad (principalmente POST).',
    endpoints: [
      {
        id: 'crearProtocolo',
        name: 'Crear protocolo',
        method: 'POST',
        path: '/api/Bioseguridad/CrearProtocolo',
        bodySchema: { Codigo: '', Titulo: '', Descripcion: '' },
      },
      {
        id: 'postSolicitud',
        name: 'Crear solicitud',
        method: 'POST',
        path: '/api/Bioseguridad/POST/{codigo}/{documento}/{descripcion}',
        pathParams: [
          { key: 'codigo', label: 'Código' },
          { key: 'documento', label: 'Documento (CI)', optionsFrom: 'pacientes' },
          { key: 'descripcion', label: 'Descripción' },
        ],
      },
      {
        id: 'postAsignacion',
        name: 'Asignar solicitud a protocolo',
        method: 'POST',
        path: '/api/Bioseguridad/{codigoProtocolo}/{codigoSolicitud}/{fechaInicio}/{fechaFin}',
        pathParams: [
          { key: 'codigoProtocolo', label: 'Código Protocolo' },
          { key: 'codigoSolicitud', label: 'Código Solicitud' },
          { key: 'fechaInicio', label: 'Fecha inicio (YYYY-MM-DD)' },
          { key: 'fechaFin', label: 'Fecha fin (YYYY-MM-DD)' },
        ],
      },
    ],
  },

  GestionLegal: {
    title: 'Gestión Legal (microservicio)',
    description: 'Solicitudes legales (POST con parámetros en query en el backend).',
    endpoints: [
      {
        id: 'solicitar',
        name: 'Solicitar',
        method: 'POST',
        path: '/api/GestionLegal/Solicitar',
        bodySchema: {
          Codigo: '',
          TipoSolicitud: '',
          Motivo: '',
          Descripcion: '',
          FechaSolicitud: '2026-01-01',
        },
      },
    ],
  },

  GestionDocumentacion: {
    title: 'Gestión Documentación (microservicio)',
    description: 'Subida de archivo (multipart/form-data).',
    endpoints: [
      {
        id: 'subir',
        name: 'Subir archivo',
        method: 'POST',
        path: '/api/GestionDocumentacion/SubirArchivo',
        multipart: true,
        fileParam: { key: 'Archivo', label: 'Archivo' },
        formSchema: {
          NombreArchivo: '',
          DescripcionContenido: '',
          NombreMedico: '',
          NombreDepartamento: '',
          CodigoPaciente: '',
          CodigoSolicitud: '',
          CodigoTipoDoc: '',
        },
      },
    ],
  },

  RecursosHumanos: {
    title: 'Recursos Humanos',
    description: 'GET de empleados (mock) + GET de pacientes vía microservicio.',
    endpoints: [
      { id: 'empleados', name: 'Listar empleados', method: 'GET', path: '/api/RecursosHumanos/ListarEmpleados' },
      { id: 'pacientes', name: 'Listar pacientes', method: 'GET', path: '/api/RecursosHumanos/ListarPacientes' },
    ],
  },

  RecoleccionResultados: {
    title: 'Recolección Resultados',
    description: 'CRUD con clave compuesta (recolección + resultado).',
    endpoints: [
      { id: 'list', name: 'Lista', method: 'GET', path: '/api/Recoleccion_Resultados/Lista' },
      {
        id: 'get',
        name: 'Buscar',
        method: 'GET',
        path: '/api/Recoleccion_Resultados/{codigoRecoleccion}/{codigoResultado}',
        pathParams: [
          { key: 'codigoRecoleccion', label: 'Código Recolección' },
          { key: 'codigoResultado', label: 'Código Resultado' },
        ],
      },
      {
        id: 'pendientes',
        name: 'Pendientes asignación',
        method: 'GET',
        path: '/api/Recoleccion_Resultados/6.PendientesAsignacion',
      },
      {
        id: 'create',
        name: 'Asignar',
        method: 'POST',
        path: '/api/Recoleccion_Resultados/Asignar',
        bodySchema: { CodigoRecoleccion: '', CodigoResultado: '' },
      },
      {
        id: 'update',
        name: 'Actualizar',
        method: 'PUT',
        path: '/api/Recoleccion_Resultados/Actualizar/{codigoRecoleccion}/{codigoResultado}',
        pathParams: [
          { key: 'codigoRecoleccion', label: 'Código Recolección (URL)' },
          { key: 'codigoResultado', label: 'Código Resultado (URL)' },
        ],
        bodySchema: { CodigoRecoleccion: '', CodigoResultado: '' },
      },
      {
        id: 'delete',
        name: 'Eliminar',
        method: 'DELETE',
        path: '/api/Recoleccion_Resultados/Eliminar/{codigoRecoleccion}/{codigoResultado}',
        pathParams: [
          { key: 'codigoRecoleccion', label: 'Código Recolección' },
          { key: 'codigoResultado', label: 'Código Resultado' },
        ],
      },
    ],
  },
};

