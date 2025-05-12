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

import { create } from '../../stores/patients/patientsSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  user: '',

  organization: '',

  full_name_en: '',

  full_name_ar: '',

  date_of_birth: '',

  gender: 'Male',

  nationality: '',

  identifier_type: 'NationalID',

  identifier: '',

  address: '',

  emergency_contact_name: '',

  emergency_contact_phone: '',

  medical_history: '',

  allergies: '',

  current_medications: '',

  family_history: '',

  organizations: '',
};

const PatientsNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/patients/patients-list');
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
              <FormField label='User' labelFor='user'>
                <Field
                  name='user'
                  id='user'
                  component={SelectField}
                  options={[]}
                  itemRef={'users'}
                ></Field>
              </FormField>

              <FormField label='Organization' labelFor='organization'>
                <Field
                  name='organization'
                  id='organization'
                  component={SelectField}
                  options={[]}
                  itemRef={'organizations'}
                ></Field>
              </FormField>

              <FormField label='FullName(English)'>
                <Field name='full_name_en' placeholder='FullName(English)' />
              </FormField>

              <FormField label='FullName(Arabic)'>
                <Field name='full_name_ar' placeholder='FullName(Arabic)' />
              </FormField>

              <FormField label='DateofBirth'>
                <Field
                  type='datetime-local'
                  name='date_of_birth'
                  placeholder='DateofBirth'
                />
              </FormField>

              <FormField label='Gender' labelFor='gender'>
                <Field name='gender' id='gender' component='select'>
                  <option value='Male'>Male</option>

                  <option value='Female'>Female</option>

                  <option value='Other'>Other</option>
                </Field>
              </FormField>

              <FormField label='Nationality'>
                <Field name='nationality' placeholder='Nationality' />
              </FormField>

              <FormField label='IdentifierType' labelFor='identifier_type'>
                <Field
                  name='identifier_type'
                  id='identifier_type'
                  component='select'
                >
                  <option value='NationalID'>NationalID</option>

                  <option value='Iqama'>Iqama</option>

                  <option value='Passport'>Passport</option>
                </Field>
              </FormField>

              <FormField label='Identifier'>
                <Field name='identifier' placeholder='Identifier' />
              </FormField>

              <FormField label='Address'>
                <Field name='address' placeholder='Address' />
              </FormField>

              <FormField label='EmergencyContactName'>
                <Field
                  name='emergency_contact_name'
                  placeholder='EmergencyContactName'
                />
              </FormField>

              <FormField label='EmergencyContactPhone'>
                <Field
                  name='emergency_contact_phone'
                  placeholder='EmergencyContactPhone'
                />
              </FormField>

              <FormField label='MedicalHistory' hasTextareaHeight>
                <Field
                  name='medical_history'
                  as='textarea'
                  placeholder='MedicalHistory'
                />
              </FormField>

              <FormField label='Allergies' hasTextareaHeight>
                <Field name='allergies' as='textarea' placeholder='Allergies' />
              </FormField>

              <FormField label='CurrentMedications' hasTextareaHeight>
                <Field
                  name='current_medications'
                  as='textarea'
                  placeholder='CurrentMedications'
                />
              </FormField>

              <FormField label='FamilyHistory' hasTextareaHeight>
                <Field
                  name='family_history'
                  as='textarea'
                  placeholder='FamilyHistory'
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
                  onClick={() => router.push('/patients/patients-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

PatientsNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_PATIENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default PatientsNew;
