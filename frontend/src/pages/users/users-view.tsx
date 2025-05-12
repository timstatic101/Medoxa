import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/users/usersSlice';
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

const UsersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

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
        <title>{getPageTitle('View users')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View users')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/users/users-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>First Name</p>
            <p>{users?.firstName}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Last Name</p>
            <p>{users?.lastName}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Phone Number</p>
            <p>{users?.phoneNumber}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>E-Mail</p>
            <p>{users?.email}</p>
          </div>

          <FormField label='Disabled'>
            <SwitchField
              field={{ name: 'disabled', value: users?.disabled }}
              form={{ setFieldValue: () => null }}
              disabled
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Avatar</p>
            {users?.avatar?.length ? (
              <ImageField
                name={'avatar'}
                image={users?.avatar}
                className='w-20 h-20'
              />
            ) : (
              <p>No Avatar</p>
            )}
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>App Role</p>

            <p>{users?.app_role?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Custom Permissions</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.custom_permissions &&
                      Array.isArray(users.custom_permissions) &&
                      users.custom_permissions.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/permissions/permissions-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.custom_permissions?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Organizations</p>

            <p>{users?.organizations?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Appointments Doctor</p>
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
                    {users.appointments_doctor &&
                      Array.isArray(users.appointments_doctor) &&
                      users.appointments_doctor.map((item: any) => (
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
              {!users?.appointments_doctor?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Doctor_availabilities Doctor
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Weekday</th>

                      <th>MorningStartTime</th>

                      <th>MorningEndTime</th>

                      <th>EveningStartTime</th>

                      <th>EveningEndTime</th>

                      <th>SlotDurationMinutes</th>

                      <th>IsActive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.doctor_availabilities_doctor &&
                      Array.isArray(users.doctor_availabilities_doctor) &&
                      users.doctor_availabilities_doctor.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/doctor_availabilities/doctor_availabilities-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='weekday'>{item.weekday}</td>

                          <td data-label='morning_start_time'>
                            {dataFormatter.dateTimeFormatter(
                              item.morning_start_time,
                            )}
                          </td>

                          <td data-label='morning_end_time'>
                            {dataFormatter.dateTimeFormatter(
                              item.morning_end_time,
                            )}
                          </td>

                          <td data-label='evening_start_time'>
                            {dataFormatter.dateTimeFormatter(
                              item.evening_start_time,
                            )}
                          </td>

                          <td data-label='evening_end_time'>
                            {dataFormatter.dateTimeFormatter(
                              item.evening_end_time,
                            )}
                          </td>

                          <td data-label='slot_duration_minutes'>
                            {item.slot_duration_minutes}
                          </td>

                          <td data-label='is_active'>
                            {dataFormatter.booleanFormatter(item.is_active)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.doctor_availabilities_doctor?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Holidays Doctor</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>StartDate</th>

                      <th>EndDate</th>

                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.holidays_doctor &&
                      Array.isArray(users.holidays_doctor) &&
                      users.holidays_doctor.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/holidays/holidays-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='start_date'>
                            {dataFormatter.dateTimeFormatter(item.start_date)}
                          </td>

                          <td data-label='end_date'>
                            {dataFormatter.dateTimeFormatter(item.end_date)}
                          </td>

                          <td data-label='notes'>{item.notes}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.holidays_doctor?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Imaging_orders ImagingTechnician
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>TotalAmount</th>

                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.imaging_orders_imaging_technician &&
                      Array.isArray(users.imaging_orders_imaging_technician) &&
                      users.imaging_orders_imaging_technician.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/imaging_orders/imaging_orders-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='total_amount'>
                              {item.total_amount}
                            </td>

                            <td data-label='status'>{item.status}</td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!users?.imaging_orders_imaging_technician?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Lab_orders LabTechnician</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>TotalAmount</th>

                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.lab_orders_lab_technician &&
                      Array.isArray(users.lab_orders_lab_technician) &&
                      users.lab_orders_lab_technician.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/lab_orders/lab_orders-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='total_amount'>{item.total_amount}</td>

                          <td data-label='status'>{item.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.lab_orders_lab_technician?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Patients User</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>FullName(English)</th>

                      <th>FullName(Arabic)</th>

                      <th>DateofBirth</th>

                      <th>Gender</th>

                      <th>Nationality</th>

                      <th>IdentifierType</th>

                      <th>Identifier</th>

                      <th>Address</th>

                      <th>EmergencyContactName</th>

                      <th>EmergencyContactPhone</th>

                      <th>MedicalHistory</th>

                      <th>Allergies</th>

                      <th>CurrentMedications</th>

                      <th>FamilyHistory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.patients_user &&
                      Array.isArray(users.patients_user) &&
                      users.patients_user.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/patients/patients-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='full_name_en'>{item.full_name_en}</td>

                          <td data-label='full_name_ar'>{item.full_name_ar}</td>

                          <td data-label='date_of_birth'>
                            {dataFormatter.dateTimeFormatter(
                              item.date_of_birth,
                            )}
                          </td>

                          <td data-label='gender'>{item.gender}</td>

                          <td data-label='nationality'>{item.nationality}</td>

                          <td data-label='identifier_type'>
                            {item.identifier_type}
                          </td>

                          <td data-label='identifier'>{item.identifier}</td>

                          <td data-label='address'>{item.address}</td>

                          <td data-label='emergency_contact_name'>
                            {item.emergency_contact_name}
                          </td>

                          <td data-label='emergency_contact_phone'>
                            {item.emergency_contact_phone}
                          </td>

                          <td data-label='medical_history'>
                            {item.medical_history}
                          </td>

                          <td data-label='allergies'>{item.allergies}</td>

                          <td data-label='current_medications'>
                            {item.current_medications}
                          </td>

                          <td data-label='family_history'>
                            {item.family_history}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.patients_user?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Pharmacy_orders Pharmacist</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>TotalAmount</th>

                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.pharmacy_orders_pharmacist &&
                      Array.isArray(users.pharmacy_orders_pharmacist) &&
                      users.pharmacy_orders_pharmacist.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/pharmacy_orders/pharmacy_orders-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='total_amount'>{item.total_amount}</td>

                          <td data-label='status'>{item.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.pharmacy_orders_pharmacist?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Visits Doctor</p>
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
                    {users.visits_doctor &&
                      Array.isArray(users.visits_doctor) &&
                      users.visits_doctor.map((item: any) => (
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
              {!users?.visits_doctor?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/users/users-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

UsersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_USERS'}>{page}</LayoutAuthenticated>
  );
};

export default UsersView;
