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

import { update, fetch } from '../../stores/lab_orders/lab_ordersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditLab_orders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    visit: null,

    lab_technician: null,

    total_amount: '',

    status: '',

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { lab_orders } = useAppSelector((state) => state.lab_orders);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { lab_ordersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: lab_ordersId }));
  }, [lab_ordersId]);

  useEffect(() => {
    if (typeof lab_orders === 'object') {
      setInitialValues(lab_orders);
    }
  }, [lab_orders]);

  useEffect(() => {
    if (typeof lab_orders === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = lab_orders[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [lab_orders]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: lab_ordersId, data }));
    await router.push('/lab_orders/lab_orders-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit lab_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit lab_orders'}
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

              <FormField label='LabTechnician' labelFor='lab_technician'>
                <Field
                  name='lab_technician'
                  id='lab_technician'
                  component={SelectField}
                  options={initialValues.lab_technician}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='TotalAmount'>
                <Field
                  type='number'
                  name='total_amount'
                  placeholder='TotalAmount'
                />
              </FormField>

              <FormField label='Status' labelFor='status'>
                <Field name='status' id='status' component='select'>
                  <option value='Pending'>Pending</option>

                  <option value='Completed'>Completed</option>
                </Field>
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
                  onClick={() => router.push('/lab_orders/lab_orders-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditLab_orders.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_LAB_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditLab_orders;
