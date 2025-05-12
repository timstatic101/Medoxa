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

import { update, fetch } from '../../stores/insurances/insurancesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditInsurancesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    patient: null,

    provider_name: '',

    policy_number: '',

    coverage_start: new Date(),

    coverage_end: new Date(),

    plan_details: '',

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { insurances } = useAppSelector((state) => state.insurances);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof insurances === 'object') {
      setInitialValues(insurances);
    }
  }, [insurances]);

  useEffect(() => {
    if (typeof insurances === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = insurances[el]),
      );
      setInitialValues(newInitialVal);
    }
  }, [insurances]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/insurances/insurances-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit insurances')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit insurances'}
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

              <FormField label='ProviderName'>
                <Field name='provider_name' placeholder='ProviderName' />
              </FormField>

              <FormField label='PolicyNumber'>
                <Field name='policy_number' placeholder='PolicyNumber' />
              </FormField>

              <FormField label='CoverageStart'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.coverage_start
                      ? new Date(
                          dayjs(initialValues.coverage_start).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, coverage_start: date })
                  }
                />
              </FormField>

              <FormField label='CoverageEnd'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.coverage_end
                      ? new Date(
                          dayjs(initialValues.coverage_end).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, coverage_end: date })
                  }
                />
              </FormField>

              <FormField label='PlanDetails' hasTextareaHeight>
                <Field
                  name='plan_details'
                  as='textarea'
                  placeholder='PlanDetails'
                />
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
                  onClick={() => router.push('/insurances/insurances-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditInsurancesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_INSURANCES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditInsurancesPage;
