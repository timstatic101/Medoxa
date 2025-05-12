import dayjs from 'dayjs';
import _ from 'lodash';

export default {
  filesFormatter(arr) {
    if (!arr || !arr.length) return [];
    return arr.map((item) => item);
  },
  imageFormatter(arr) {
    if (!arr || !arr.length) return [];
    return arr.map((item) => ({
      publicUrl: item.publicUrl || '',
    }));
  },
  oneImageFormatter(arr) {
    if (!arr || !arr.length) return '';
    return arr[0].publicUrl || '';
  },
  dateFormatter(date) {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD');
  },
  dateTimeFormatter(date) {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  },
  booleanFormatter(val) {
    return val ? 'Yes' : 'No';
  },
  dataGridEditFormatter(obj) {
    return _.transform(obj, (result, value, key) => {
      if (_.isArray(value)) {
        result[key] = _.map(value, 'id');
      } else if (_.isObject(value)) {
        result[key] = value.id;
      } else {
        result[key] = value;
      }
    });
  },

  usersManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.firstName);
  },
  usersOneListFormatter(val) {
    if (!val) return '';
    return val.firstName;
  },
  usersManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.firstName };
    });
  },
  usersOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.firstName, id: val.id };
  },

  appointmentsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.type);
  },
  appointmentsOneListFormatter(val) {
    if (!val) return '';
    return val.type;
  },
  appointmentsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.type };
    });
  },
  appointmentsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.type, id: val.id };
  },

  departmentsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  departmentsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  departmentsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  departmentsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  imaging_investigationsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  imaging_investigationsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  imaging_investigationsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  imaging_investigationsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  imaging_ordersManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.status);
  },
  imaging_ordersOneListFormatter(val) {
    if (!val) return '';
    return val.status;
  },
  imaging_ordersManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.status };
    });
  },
  imaging_ordersOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.status, id: val.id };
  },

  invoicesManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.total_amount);
  },
  invoicesOneListFormatter(val) {
    if (!val) return '';
    return val.total_amount;
  },
  invoicesManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.total_amount };
    });
  },
  invoicesOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.total_amount, id: val.id };
  },

  lab_ordersManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.status);
  },
  lab_ordersOneListFormatter(val) {
    if (!val) return '';
    return val.status;
  },
  lab_ordersManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.status };
    });
  },
  lab_ordersOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.status, id: val.id };
  },

  lab_testsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  lab_testsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  lab_testsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  lab_testsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  medicationsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  medicationsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  medicationsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  medicationsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  patientsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.full_name_en);
  },
  patientsOneListFormatter(val) {
    if (!val) return '';
    return val.full_name_en;
  },
  patientsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.full_name_en };
    });
  },
  patientsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.full_name_en, id: val.id };
  },

  pharmacy_ordersManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.status);
  },
  pharmacy_ordersOneListFormatter(val) {
    if (!val) return '';
    return val.status;
  },
  pharmacy_ordersManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.status };
    });
  },
  pharmacy_ordersOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.status, id: val.id };
  },

  visitsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.symptoms);
  },
  visitsOneListFormatter(val) {
    if (!val) return '';
    return val.symptoms;
  },
  visitsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.symptoms };
    });
  },
  visitsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.symptoms, id: val.id };
  },

  rolesManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  rolesOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  rolesManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  rolesOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  permissionsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  permissionsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  permissionsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  permissionsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  organizationsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  organizationsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  organizationsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  organizationsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },
};
