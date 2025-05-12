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

import { create } from '../../stores/doctor_availabilities/doctor_availabilitiesSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  doctor: '',

  weekday: '',

  morning_start_time: '',

  morning_end_time: '',

  evening_start_time: '',

  evening_end_time: '',

  slot_duration_minutes: '',

  is_active: false,

  organizations: '',
};

const Doctor_availabilitiesNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/doctor_availabilities/doctor_availabilities-list');
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
              <FormField label='Doctor' labelFor='doctor'>
                <Field
                  name='doctor'
                  id='doctor'
                  component={SelectField}
                  options={[]}
                  itemRef={'users'}
                ></Field>
              </FormField>

              <FormField label='Weekday'>
                <Field name='weekday' placeholder='Weekday' />
              </FormField>

              <FormField label='MorningStartTime'>
                <Field
                  type='datetime-local'
                  name='morning_start_time'
                  placeholder='MorningStartTime'
                />
              </FormField>

              <FormField label='MorningEndTime'>
                <Field
                  type='datetime-local'
                  name='morning_end_time'
                  placeholder='MorningEndTime'
                />
              </FormField>

              <FormField label='EveningStartTime'>
                <Field
                  type='datetime-local'
                  name='evening_start_time'
                  placeholder='EveningStartTime'
                />
              </FormField>

              <FormField label='EveningEndTime'>
                <Field
                  type='datetime-local'
                  name='evening_end_time'
                  placeholder='EveningEndTime'
                />
              </FormField>

              <FormField label='SlotDurationMinutes'>
                <Field
                  type='number'
                  name='slot_duration_minutes'
                  placeholder='SlotDurationMinutes'
                />
              </FormField>

              <FormField label='IsActive' labelFor='is_active'>
                <Field
                  name='is_active'
                  id='is_active'
                  component={SwitchField}
                ></Field>
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
                  onClick={() =>
                    router.push(
                      '/doctor_availabilities/doctor_availabilities-list',
                    )
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

Doctor_availabilitiesNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_DOCTOR_AVAILABILITIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Doctor_availabilitiesNew;
