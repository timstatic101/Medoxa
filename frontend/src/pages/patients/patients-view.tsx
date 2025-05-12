import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/patients/patientsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const PatientsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patients);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View patients')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View patients')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/patients/patients-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>User</p>

            <p>{patients?.user?.firstName ?? 'No data'}</p>
          </div>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>Organization</p>

              <p>{patients?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>FullName(English)</p>
            <p>{patients?.full_name_en}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>FullName(Arabic)</p>
            <p>{patients?.full_name_ar}</p>
          </div>

          <FormField label='DateofBirth'>
            {patients.date_of_birth ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  patients.date_of_birth
                    ? new Date(
                        dayjs(patients.date_of_birth).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No DateofBirth</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Gender</p>
            <p>{patients?.gender ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Nationality</p>
            <p>{patients?.nationality}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>IdentifierType</p>
            <p>{patients?.identifier_type ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Identifier</p>
            <p>{patients?.identifier}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Address</p>
            <p>{patients?.address}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>EmergencyContactName</p>
            <p>{patients?.emergency_contact_name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>EmergencyContactPhone</p>
            <p>{patients?.emergency_contact_phone}</p>
          </div>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={patients?.medical_history}
            />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={patients?.allergies}
            />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={patients?.current_medications}
            />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={patients?.family_history}
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>organizations</p>

            <p>{patients?.organizations?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Appointments Patient</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>AppointmentDate</th>

                      <th>StartTime</th>

                      <th>EndTime</th>

                      <th>Type</th>

                      <th>Status</th>

                      <th>ReminderSent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.appointments_patient &&
                      Array.isArray(patients.appointments_patient) &&
                      patients.appointments_patient.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/appointments/appointments-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='appointment_date'>
                            {dataFormatter.dateTimeFormatter(
                              item.appointment_date,
                            )}
                          </td>

                          <td data-label='start_time'>
                            {dataFormatter.dateTimeFormatter(item.start_time)}
                          </td>

                          <td data-label='end_time'>
                            {dataFormatter.dateTimeFormatter(item.end_time)}
                          </td>

                          <td data-label='type'>{item.type}</td>

                          <td data-label='status'>{item.status}</td>

                          <td data-label='reminder_sent'>
                            {dataFormatter.booleanFormatter(item.reminder_sent)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!patients?.appointments_patient?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Insurances Patient</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>ProviderName</th>

                      <th>PolicyNumber</th>

                      <th>CoverageStart</th>

                      <th>CoverageEnd</th>

                      <th>PlanDetails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.insurances_patient &&
                      Array.isArray(patients.insurances_patient) &&
                      patients.insurances_patient.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/insurances/insurances-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='provider_name'>
                            {item.provider_name}
                          </td>

                          <td data-label='policy_number'>
                            {item.policy_number}
                          </td>

                          <td data-label='coverage_start'>
                            {dataFormatter.dateTimeFormatter(
                              item.coverage_start,
                            )}
                          </td>

                          <td data-label='coverage_end'>
                            {dataFormatter.dateTimeFormatter(item.coverage_end)}
                          </td>

                          <td data-label='plan_details'>{item.plan_details}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!patients?.insurances_patient?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Invoices Patient</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>TotalAmount</th>

                      <th>VATAmount</th>

                      <th>IsPaid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.invoices_patient &&
                      Array.isArray(patients.invoices_patient) &&
                      patients.invoices_patient.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/invoices/invoices-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='total_amount'>{item.total_amount}</td>

                          <td data-label='vat_amount'>{item.vat_amount}</td>

                          <td data-label='is_paid'>
                            {dataFormatter.booleanFormatter(item.is_paid)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!patients?.invoices_patient?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Patient_documents Patient</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>DocumentType</th>

                      <th>DocumentURL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.patient_documents_patient &&
                      Array.isArray(patients.patient_documents_patient) &&
                      patients.patient_documents_patient.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/patient_documents/patient_documents-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='document_type'>
                            {item.document_type}
                          </td>

                          <td data-label='document_url'>{item.document_url}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!patients?.patient_documents_patient?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Visits Patient</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>VisitDateTime</th>

                      <th>Symptoms</th>

                      <th>Diagnosis</th>

                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.visits_patient &&
                      Array.isArray(patients.visits_patient) &&
                      patients.visits_patient.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/visits/visits-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='visit_datetime'>
                            {dataFormatter.dateTimeFormatter(
                              item.visit_datetime,
                            )}
                          </td>

                          <td data-label='symptoms'>{item.symptoms}</td>

                          <td data-label='diagnosis'>{item.diagnosis}</td>

                          <td data-label='notes'>{item.notes}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!patients?.visits_patient?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/patients/patients-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

PatientsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_PATIENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default PatientsView;
