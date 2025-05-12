import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/visits/visitsSlice';
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

const VisitsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { visits } = useAppSelector((state) => state.visits);

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
        <title>{getPageTitle('View visits')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View visits')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/visits/visits-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Patient</p>

            <p>{visits?.patient?.full_name_en ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Doctor</p>

            <p>{visits?.doctor?.firstName ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Department</p>

            <p>{visits?.department?.name ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Appointment</p>

            <p>{visits?.appointment?.type ?? 'No data'}</p>
          </div>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>Organization</p>

              <p>{visits?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <FormField label='VisitDateTime'>
            {visits.visit_datetime ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  visits.visit_datetime
                    ? new Date(
                        dayjs(visits.visit_datetime).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No VisitDateTime</p>
            )}
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea className={'w-full'} disabled value={visits?.symptoms} />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea className={'w-full'} disabled value={visits?.diagnosis} />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea className={'w-full'} disabled value={visits?.notes} />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>organizations</p>

            <p>{visits?.organizations?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Imaging_orders Visit</p>
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
                    {visits.imaging_orders_visit &&
                      Array.isArray(visits.imaging_orders_visit) &&
                      visits.imaging_orders_visit.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/imaging_orders/imaging_orders-view/?id=${item.id}`,
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
              {!visits?.imaging_orders_visit?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Invoices Visit</p>
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
                    {visits.invoices_visit &&
                      Array.isArray(visits.invoices_visit) &&
                      visits.invoices_visit.map((item: any) => (
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
              {!visits?.invoices_visit?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Lab_orders Visit</p>
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
                    {visits.lab_orders_visit &&
                      Array.isArray(visits.lab_orders_visit) &&
                      visits.lab_orders_visit.map((item: any) => (
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
              {!visits?.lab_orders_visit?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Pharmacy_orders Visit</p>
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
                    {visits.pharmacy_orders_visit &&
                      Array.isArray(visits.pharmacy_orders_visit) &&
                      visits.pharmacy_orders_visit.map((item: any) => (
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
              {!visits?.pharmacy_orders_visit?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Sick_leaves Visit</p>
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

                      <th>Diagnosis</th>

                      <th>Instructions</th>

                      <th>DocumentURL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.sick_leaves_visit &&
                      Array.isArray(visits.sick_leaves_visit) &&
                      visits.sick_leaves_visit.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/sick_leaves/sick_leaves-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='start_date'>
                            {dataFormatter.dateTimeFormatter(item.start_date)}
                          </td>

                          <td data-label='end_date'>
                            {dataFormatter.dateTimeFormatter(item.end_date)}
                          </td>

                          <td data-label='diagnosis'>{item.diagnosis}</td>

                          <td data-label='instructions'>{item.instructions}</td>

                          <td data-label='document_url'>{item.document_url}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!visits?.sick_leaves_visit?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/visits/visits-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

VisitsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_VISITS'}>{page}</LayoutAuthenticated>
  );
};

export default VisitsView;
