import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/departments/departmentsSlice';
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

const DepartmentsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector((state) => state.departments);

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
        <title>{getPageTitle('View departments')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View departments')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/departments/departments-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>Organization</p>

              <p>{departments?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{departments?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Description</p>
            <p>{departments?.description}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>organizations</p>

            <p>{departments?.organizations?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>
              Appointment_rules Department
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>MinHoursBeforeBooking</th>

                      <th>MaxDaysAdvanceBooking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.appointment_rules_department &&
                      Array.isArray(departments.appointment_rules_department) &&
                      departments.appointment_rules_department.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/appointment_rules/appointment_rules-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='min_hours_before_booking'>
                              {item.min_hours_before_booking}
                            </td>

                            <td data-label='max_days_advance_booking'>
                              {item.max_days_advance_booking}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!departments?.appointment_rules_department?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Appointments Department</p>
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
                    {departments.appointments_department &&
                      Array.isArray(departments.appointments_department) &&
                      departments.appointments_department.map((item: any) => (
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
              {!departments?.appointments_department?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Holidays Department</p>
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
                    {departments.holidays_department &&
                      Array.isArray(departments.holidays_department) &&
                      departments.holidays_department.map((item: any) => (
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
              {!departments?.holidays_department?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Visits Department</p>
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
                    {departments.visits_department &&
                      Array.isArray(departments.visits_department) &&
                      departments.visits_department.map((item: any) => (
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
              {!departments?.visits_department?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/departments/departments-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

DepartmentsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_DEPARTMENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default DepartmentsView;
