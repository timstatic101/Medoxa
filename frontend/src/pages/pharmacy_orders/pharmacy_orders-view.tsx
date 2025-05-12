import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/pharmacy_orders/pharmacy_ordersSlice';
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

const Pharmacy_ordersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pharmacy_orders } = useAppSelector((state) => state.pharmacy_orders);

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
        <title>{getPageTitle('View pharmacy_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View pharmacy_orders')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/pharmacy_orders/pharmacy_orders-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Visit</p>

            <p>{pharmacy_orders?.visit?.symptoms ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Pharmacist</p>

            <p>{pharmacy_orders?.pharmacist?.firstName ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>TotalAmount</p>
            <p>{pharmacy_orders?.total_amount || 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Status</p>
            <p>{pharmacy_orders?.status ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>organizations</p>

            <p>{pharmacy_orders?.organizations?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>
              Pharmacy_order_items PharmacyOrder
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacy_orders.pharmacy_order_items_pharmacy_order &&
                      Array.isArray(
                        pharmacy_orders.pharmacy_order_items_pharmacy_order,
                      ) &&
                      pharmacy_orders.pharmacy_order_items_pharmacy_order.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/pharmacy_order_items/pharmacy_order_items-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='quantity'>{item.quantity}</td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!pharmacy_orders?.pharmacy_order_items_pharmacy_order
                ?.length && <div className={'text-center py-4'}>No data</div>}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/pharmacy_orders/pharmacy_orders-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Pharmacy_ordersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_PHARMACY_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Pharmacy_ordersView;
