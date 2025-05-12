import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/doctor_availabilities/doctor_availabilitiesSlice';
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

const Doctor_availabilitiesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { doctor_availabilities } = useAppSelector(
    (state) => state.doctor_availabilities,
  );

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
        <title>{getPageTitle('View doctor_availabilities')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View doctor_availabilities')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/doctor_availabilities/doctor_availabilities-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Doctor</p>

            <p>{doctor_availabilities?.doctor?.firstName ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Weekday</p>
            <p>{doctor_availabilities?.weekday}</p>
          </div>

          <FormField label='MorningStartTime'>
            {doctor_availabilities.morning_start_time ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  doctor_availabilities.morning_start_time
                    ? new Date(
                        dayjs(doctor_availabilities.morning_start_time).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No MorningStartTime</p>
            )}
          </FormField>

          <FormField label='MorningEndTime'>
            {doctor_availabilities.morning_end_time ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  doctor_availabilities.morning_end_time
                    ? new Date(
                        dayjs(doctor_availabilities.morning_end_time).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No MorningEndTime</p>
            )}
          </FormField>

          <FormField label='EveningStartTime'>
            {doctor_availabilities.evening_start_time ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  doctor_availabilities.evening_start_time
                    ? new Date(
                        dayjs(doctor_availabilities.evening_start_time).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No EveningStartTime</p>
            )}
          </FormField>

          <FormField label='EveningEndTime'>
            {doctor_availabilities.evening_end_time ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  doctor_availabilities.evening_end_time
                    ? new Date(
                        dayjs(doctor_availabilities.evening_end_time).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No EveningEndTime</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>SlotDurationMinutes</p>
            <p>{doctor_availabilities?.slot_duration_minutes || 'No data'}</p>
          </div>

          <FormField label='IsActive'>
            <SwitchField
              field={{
                name: 'is_active',
                value: doctor_availabilities?.is_active,
              }}
              form={{ setFieldValue: () => null }}
              disabled
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>organizations</p>

            <p>{doctor_availabilities?.organizations?.name ?? 'No data'}</p>
          </div>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() =>
              router.push('/doctor_availabilities/doctor_availabilities-list')
            }
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Doctor_availabilitiesView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_DOCTOR_AVAILABILITIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Doctor_availabilitiesView;
