import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/invoices/invoicesSlice';
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

const InvoicesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { invoices } = useAppSelector((state) => state.invoices);

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
        <title>{getPageTitle('View invoices')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View invoices')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/invoices/invoices-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Patient</p>

            <p>{invoices?.patient?.full_name_en ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Visit</p>

            <p>{invoices?.visit?.symptoms ?? 'No data'}</p>
          </div>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>Organization</p>

              <p>{invoices?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>TotalAmount</p>
            <p>{invoices?.total_amount || 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>VATAmount</p>
            <p>{invoices?.vat_amount || 'No data'}</p>
          </div>

          <FormField label='IsPaid'>
            <SwitchField
              field={{ name: 'is_paid', value: invoices?.is_paid }}
              form={{ setFieldValue: () => null }}
              disabled
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>organizations</p>

            <p>{invoices?.organizations?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Invoice_items Invoice</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>

                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.invoice_items_invoice &&
                      Array.isArray(invoices.invoice_items_invoice) &&
                      invoices.invoice_items_invoice.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/invoice_items/invoice_items-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='description'>{item.description}</td>

                          <td data-label='amount'>{item.amount}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!invoices?.invoice_items_invoice?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/invoices/invoices-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

InvoicesView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_INVOICES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default InvoicesView;
