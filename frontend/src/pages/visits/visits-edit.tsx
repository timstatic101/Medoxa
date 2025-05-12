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

import { update, fetch } from '../../stores/visits/visitsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditVisitsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    patient: null,

    doctor: null,

    department: null,

    appointment: null,

    organization: null,

    visit_datetime: new Date(),

    symptoms: '',

    diagnosis: '',

    notes: '',

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { visits } = useAppSelector((state) => state.visits);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof visits === 'object') {
      setInitialValues(visits);
    }
  }, [visits]);

  useEffect(() => {
    if (typeof visits === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach((el) => (newInitialVal[el] = visits[el]));
      setInitialValues(newInitialVal);
    }
  }, [visits]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/visits/visits-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit visits')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit visits'}
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

              <FormField label='Appointment' labelFor='appointment'>
                <Field
                  name='appointment'
                  id='appointment'
                  component={SelectField}
                  options={initialValues.appointment}
                  itemRef={'appointments'}
                  showField={'type'}
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

              <FormField label='VisitDateTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.visit_datetime
                      ? new Date(
                          dayjs(initialValues.visit_datetime).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, visit_datetime: date })
                  }
                />
              </FormField>

              <FormField label='Symptoms' hasTextareaHeight>
                <Field name='symptoms' as='textarea' placeholder='Symptoms' />
              </FormField>

              <FormField label='Diagnosis' hasTextareaHeight>
                <Field name='diagnosis' as='textarea' placeholder='Diagnosis' />
              </FormField>

              <FormField label='Notes' hasTextareaHeight>
                <Field name='notes' as='textarea' placeholder='Notes' />
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
                  onClick={() => router.push('/visits/visits-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditVisitsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_VISITS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditVisitsPage;
