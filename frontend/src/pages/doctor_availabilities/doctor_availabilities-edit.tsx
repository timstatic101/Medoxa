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
} from '../../stores/doctor_availabilities/doctor_availabilitiesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditDoctor_availabilitiesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    doctor: null,

    weekday: '',

    morning_start_time: new Date(),

    morning_end_time: new Date(),

    evening_start_time: new Date(),

    evening_end_time: new Date(),

    slot_duration_minutes: '',

    is_active: false,

    organizations: null,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { doctor_availabilities } = useAppSelector(
    (state) => state.doctor_availabilities,
  );

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof doctor_availabilities === 'object') {
      setInitialValues(doctor_availabilities);
    }
  }, [doctor_availabilities]);

  useEffect(() => {
    if (typeof doctor_availabilities === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = doctor_availabilities[el]),
      );
      setInitialValues(newInitialVal);
    }
  }, [doctor_availabilities]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/doctor_availabilities/doctor_availabilities-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit doctor_availabilities')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit doctor_availabilities'}
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

              <FormField label='Weekday'>
                <Field name='weekday' placeholder='Weekday' />
              </FormField>

              <FormField label='MorningStartTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.morning_start_time
                      ? new Date(
                          dayjs(initialValues.morning_start_time).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      morning_start_time: date,
                    })
                  }
                />
              </FormField>

              <FormField label='MorningEndTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.morning_end_time
                      ? new Date(
                          dayjs(initialValues.morning_end_time).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      morning_end_time: date,
                    })
                  }
                />
              </FormField>

              <FormField label='EveningStartTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.evening_start_time
                      ? new Date(
                          dayjs(initialValues.evening_start_time).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      evening_start_time: date,
                    })
                  }
                />
              </FormField>

              <FormField label='EveningEndTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.evening_end_time
                      ? new Date(
                          dayjs(initialValues.evening_end_time).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      evening_end_time: date,
                    })
                  }
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

EditDoctor_availabilitiesPage.getLayout = function getLayout(
  page: ReactElement,
) {
  return (
    <LayoutAuthenticated permission={'UPDATE_DOCTOR_AVAILABILITIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditDoctor_availabilitiesPage;
