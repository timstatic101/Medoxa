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

import { update, fetch } from '../../stores/invoices/invoicesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditInvoicesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    patient: null,

    visit: null,

    organization: null,

    total_amount: '',

    vat_amount: '',

    is_paid: false,

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { invoices } = useAppSelector((state) => state.invoices);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof invoices === 'object') {
      setInitialValues(invoices);
    }
  }, [invoices]);

  useEffect(() => {
    if (typeof invoices === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach((el) => (newInitialVal[el] = invoices[el]));
      setInitialValues(newInitialVal);
    }
  }, [invoices]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/invoices/invoices-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit invoices')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit invoices'}
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

              <FormField label='Visit' labelFor='visit'>
                <Field
                  name='visit'
                  id='visit'
                  component={SelectField}
                  options={initialValues.visit}
                  itemRef={'visits'}
                  showField={'symptoms'}
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

              <FormField label='TotalAmount'>
                <Field
                  type='number'
                  name='total_amount'
                  placeholder='TotalAmount'
                />
              </FormField>

              <FormField label='VATAmount'>
                <Field
                  type='number'
                  name='vat_amount'
                  placeholder='VATAmount'
                />
              </FormField>

              <FormField label='IsPaid' labelFor='is_paid'>
                <Field
                  name='is_paid'
                  id='is_paid'
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
                  onClick={() => router.push('/invoices/invoices-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditInvoicesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_INVOICES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditInvoicesPage;
