import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
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
import { SwitchField } from '../../components/SwitchField';

import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { RichTextField } from '../../components/RichTextField';

import { create } from '../../stores/insurances/insurancesSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  patient: '',

  provider_name: '',

  policy_number: '',

  coverage_start: '',

  coverage_end: '',

  plan_details: '',

  organizations: '',
};

const InsurancesNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/insurances/insurances-list');
  };
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='New Item'
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Patient' labelFor='patient'>
                <Field
                  name='patient'
                  id='patient'
                  component={SelectField}
                  options={[]}
                  itemRef={'patients'}
                ></Field>
              </FormField>

              <FormField label='ProviderName'>
                <Field name='provider_name' placeholder='ProviderName' />
              </FormField>

              <FormField label='PolicyNumber'>
                <Field name='policy_number' placeholder='PolicyNumber' />
              </FormField>

              <FormField label='CoverageStart'>
                <Field
                  type='datetime-local'
                  name='coverage_start'
                  placeholder='CoverageStart'
                />
              </FormField>

              <FormField label='CoverageEnd'>
                <Field
                  type='datetime-local'
                  name='coverage_end'
                  placeholder='CoverageEnd'
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
                  options={[]}
                  itemRef={'organizations'}
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

InsurancesNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_INSURANCES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default InsurancesNew;
