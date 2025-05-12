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
} from '../../stores/imaging_order_items/imaging_order_itemsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditImaging_order_itemsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    imaging_order: null,

    imaging_investigation: null,

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { imaging_order_items } = useAppSelector(
    (state) => state.imaging_order_items,
  );

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof imaging_order_items === 'object') {
      setInitialValues(imaging_order_items);
    }
  }, [imaging_order_items]);

  useEffect(() => {
    if (typeof imaging_order_items === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = imaging_order_items[el]),
      );
      setInitialValues(newInitialVal);
    }
  }, [imaging_order_items]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/imaging_order_items/imaging_order_items-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit imaging_order_items')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit imaging_order_items'}
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
              <FormField label='ImagingOrder' labelFor='imaging_order'>
                <Field
                  name='imaging_order'
                  id='imaging_order'
                  component={SelectField}
                  options={initialValues.imaging_order}
                  itemRef={'imaging_orders'}
                  showField={'status'}
                ></Field>
              </FormField>

              <FormField
                label='ImagingInvestigation'
                labelFor='imaging_investigation'
              >
                <Field
                  name='imaging_investigation'
                  id='imaging_investigation'
                  component={SelectField}
                  options={initialValues.imaging_investigation}
                  itemRef={'imaging_investigations'}
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
                    router.push('/imaging_order_items/imaging_order_items-list')
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

EditImaging_order_itemsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_IMAGING_ORDER_ITEMS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditImaging_order_itemsPage;
