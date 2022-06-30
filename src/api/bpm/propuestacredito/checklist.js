const json = [
  {
    required: true,
    exception: false,
    descripcion: 'Estados Financieros Auditados',
    aprobadoPor: { nombre: 'Jean Carlos' },
    fechaAprobacion: '2021-09-09',
    actualizadoPor: { nombre: 'Johana Garcia' },
    fechaActualizacion: '2021-10-01',
    fechaExpiracion: '2021-10-29',
    comentarios: '',
    attachment: {}
  },
  {
    required: false,
    exception: false,
    descripcion: 'Cifras interinas que cuente menos de 4 meses de antigüedad del deudor o co-deudor',
    aprobadoPor: { nombre: 'Jean Carlos' },
    fechaAprobacion: '2021-09-09',
    actualizadoPor: { nombre: 'Johana Garcia' },
    fechaActualizacion: '2021-10-01',
    fechaExpiracion: null,
    comentarios: '',
    attachment: {}
  }
];

export default json;
