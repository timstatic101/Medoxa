import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/appointments/appointmentsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditAppointmentsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    patient: null,

    doctor: null,

    department: null,

    organization: null,

    appointment_date: new Date(),

    start_time: new Date(),

    end_time: new Date(),

    type: '',

    status: '',

    reminder_sent: false,

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { appointments } = useAppSelector((state) => state.appointments);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof appointments === 'object') {
      setInitialValues(appointments);
    }
  }, [appointments]);

  useEffect(() => {
    if (typeof appointments === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = appointments[el]),
      );
      setInitialValues(newInitialVal);
    }
  }, [appointments]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/appointments/appointments-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit appointments')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit appointments'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Patient' labelFor='patient'>
                <Field
                  name='patient'
                  id='patient'
                  component={SelectField}
                  options={initialValues.patient}
                  itemRef={'patients'}
                  showField={'full_name_en'}
                ></Field>
              </FormField>

              <FormField label='Doctor' labelFor='doctor'>
                <Field
                  name='doctor'
                  id='doctor'
                  component={SelectField}
                  options={initialValues.doctor}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='Department' labelFor='department'>
                <Field
                  name='department'
                  id='department'
                  component={SelectField}
                  options={initialValues.department}
                  itemRef={'departments'}
                  showField={'name'}
                ></Field>
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='Organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organizations'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <FormField label='AppointmentDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.appointment_date
                      ? new Date(
                          dayjs(initialValues.appointment_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      appointment_date: date,
                    })
                  }
                />
              </FormField>

              <FormField label='StartTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.start_time
                      ? new Date(
                          dayjs(initialValues.start_time).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, start_time: date })
                  }
                />
              </FormField>

              <FormField label='EndTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.end_time
                      ? new Date(
                          dayjs(initialValues.end_time).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, end_time: date })
                  }
                />
              </FormField>

              <FormField label='Type' labelFor='type'>
                <Field name='type' id='type' component='select'>
                  <option value='New'>New</option>

                  <option value='FollowUp'>FollowUp</option>
                </Field>
              </FormField>

              <FormField label='Status' labelFor='status'>
                <Field name='status' id='status' component='select'>
                  <option value='Scheduled'>Scheduled</option>

                  <option value='CheckedIn'>CheckedIn</option>

                  <option value='Completed'>Completed</option>

                  <option value='Canceled'>Canceled</option>

                  <option value='Rescheduled'>Rescheduled</option>
                </Field>
              </FormField>

              <FormField label='ReminderSent' labelFor='reminder_sent'>
                <Field
                  name='reminder_sent'
                  id='reminder_sent'
                  component={SwitchField}
                ></Field>
              </FormField>

              <FormField label='organizations' labelFor='organizations'>
                <Field
                  name='organizations'
                  id='organizations'
                  component={SelectField}
                  options={initialValues.organizations}
                  itemRef={'organizations'}
                  showField={'name'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/appointments/appointments-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditAppointmentsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_APPOINTMENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditAppointmentsPage;
