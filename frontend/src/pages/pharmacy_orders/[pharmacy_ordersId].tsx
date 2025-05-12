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

import {
  update,
  fetch,
} from '../../stores/pharmacy_orders/pharmacy_ordersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditPharmacy_orders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    visit: null,

    pharmacist: null,

    total_amount: '',

    status: '',

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { pharmacy_orders } = useAppSelector((state) => state.pharmacy_orders);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { pharmacy_ordersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: pharmacy_ordersId }));
  }, [pharmacy_ordersId]);

  useEffect(() => {
    if (typeof pharmacy_orders === 'object') {
      setInitialValues(pharmacy_orders);
    }
  }, [pharmacy_orders]);

  useEffect(() => {
    if (typeof pharmacy_orders === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = pharmacy_orders[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [pharmacy_orders]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: pharmacy_ordersId, data }));
    await router.push('/pharmacy_orders/pharmacy_orders-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit pharmacy_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit pharmacy_orders'}
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

              <FormField label='Pharmacist' labelFor='pharmacist'>
                <Field
                  name='pharmacist'
                  id='pharmacist'
                  component={SelectField}
                  options={initialValues.pharmacist}
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
                  onClick={() =>
                    router.push('/pharmacy_orders/pharmacy_orders-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditPharmacy_orders.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_PHARMACY_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditPharmacy_orders;
