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

import { update, fetch } from '../../stores/imaging_orders/imaging_ordersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditImaging_orders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    visit: null,

    imaging_technician: null,

    total_amount: '',

    status: '',

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { imaging_orders } = useAppSelector((state) => state.imaging_orders);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { imaging_ordersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: imaging_ordersId }));
  }, [imaging_ordersId]);

  useEffect(() => {
    if (typeof imaging_orders === 'object') {
      setInitialValues(imaging_orders);
    }
  }, [imaging_orders]);

  useEffect(() => {
    if (typeof imaging_orders === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = imaging_orders[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [imaging_orders]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: imaging_ordersId, data }));
    await router.push('/imaging_orders/imaging_orders-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit imaging_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit imaging_orders'}
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

              <FormField
                label='ImagingTechnician'
                labelFor='imaging_technician'
              >
                <Field
                  name='imaging_technician'
                  id='imaging_technician'
                  component={SelectField}
                  options={initialValues.imaging_technician}
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
                    router.push('/imaging_orders/imaging_orders-list')
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

EditImaging_orders.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_IMAGING_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditImaging_orders;
