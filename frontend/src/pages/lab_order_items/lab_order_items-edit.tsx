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
} from '../../stores/lab_order_items/lab_order_itemsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditLab_order_itemsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    lab_order: null,

    lab_test: null,

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { lab_order_items } = useAppSelector((state) => state.lab_order_items);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof lab_order_items === 'object') {
      setInitialValues(lab_order_items);
    }
  }, [lab_order_items]);

  useEffect(() => {
    if (typeof lab_order_items === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = lab_order_items[el]),
      );
      setInitialValues(newInitialVal);
    }
  }, [lab_order_items]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/lab_order_items/lab_order_items-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit lab_order_items')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit lab_order_items'}
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
              <FormField label='LabOrder' labelFor='lab_order'>
                <Field
                  name='lab_order'
                  id='lab_order'
                  component={SelectField}
                  options={initialValues.lab_order}
                  itemRef={'lab_orders'}
                  showField={'status'}
                ></Field>
              </FormField>

              <FormField label='LabTest' labelFor='lab_test'>
                <Field
                  name='lab_test'
                  id='lab_test'
                  component={SelectField}
                  options={initialValues.lab_test}
                  itemRef={'lab_tests'}
                  showField={'name'}
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
                  onClick={() =>
                    router.push('/lab_order_items/lab_order_items-list')
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

EditLab_order_itemsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_LAB_ORDER_ITEMS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditLab_order_itemsPage;
