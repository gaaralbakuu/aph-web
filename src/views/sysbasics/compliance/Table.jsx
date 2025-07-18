import React, { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import countries from 'i18n-iso-countries';
import viLocale from 'i18n-iso-countries/langs/vi.json';
import enLocale from 'i18n-iso-countries/langs/en.json';
import zhLocale from 'i18n-iso-countries/langs/zh.json';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MAX_SPACE_ROWS, STATUS } from './constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';

countries.registerLocale(viLocale);
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

function percentageColor(value) {
  if (value < 25) {
    return 'bg-red-400';
  } else if (value < 50) {
    return 'bg-orange-500';
  } else if (value < 100) {
    return 'bg-yellow-400';
  } else if (value > 100) {
    return 'bg-violet-500';
  } else {
    return 'bg-lime-500';
  }
}

function LocationItem({ total = 0, data = {} }) {
  const t = useTranslations('dashboard.report');
  const location = useQuery({
    queryKey: ['location', data.se_id, total],
    queryFn: async () => {
      if (!data.se_id || total === 0)
        return {
          data: { data: [] },
        };

      const object = Object.fromEntries(
        Object.entries({
          se_id: data.se_id,
        }).filter((v) => v[1])
      );

      let url =
        '/api/dashboard/report/location?' +
        new URLSearchParams(object).toString();

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.json();
    },
  });

  if (total === 0) return <></>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className='font-semibold'>
          {total > 0 && !location.isLoading
            ? location.data.data
                .slice(0, 2)
                .map((item) => item.NAME)
                .join(', ')
            : ''}
          {total > 2 && !location.isLoading ? ',...' : ''}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className=''>
          {location.isLoading && (
            <div className='flex justify-center py-2'>
              <svg
                aria-hidden='true'
                className='size-5 text-gray-200 animate-spin dark:text-gray-600 fill-red-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
            </div>
          )}

          {Boolean(!location.isLoading && location.data.data.length) && (
            <div className='grid w-[100px] grid-cols-2'>
              {location.data.data.map((item, index) => (
                <div className='flex items-center gap-1' key={index}>
                  <div className='size-2 bg-red-500'></div>
                  {item.NAME}
                </div>
              ))}
            </div>
          )}

          {Boolean(!location.isLoading && location.data.data.length == 0) && (
            <div className='flex justify-center py-2'>
              {t('table location empty')}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function ActionMenu({ onClick = () => undefined }) {
  return (
    <div className='relative'>
      <Button
        onClick={onClick}
        variant={'outline'}
        className='size-6 p-0 rounded hover:bg-gray-100 cursor-pointer'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-3'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
          />
        </svg>
      </Button>
    </div>
  );
}

const tableColumnConfig = [
  {
    id: 'index',
    title: '#',
    width: 70,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'location',
    title: 'table location',
    width: 140,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'so',
    title: 'table so',
    width: 140,
    textAlign: 'left',
    truncate: true,
    className: 'sticky left-0  bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa] to-transparent'
  },
  {
    id: 'shoeModel',
    title: 'table shoe model',
    width: 180,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'destination',
    title: 'table destination',
    width: 140,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'orderQuantity',
    title: 'table order quantity',
    width: 120,
    textAlign: 'right',
    truncate: true,
  },
  {
    id: 'inboundQuantity',
    title: 'table inbound quantity',
    width: 150,
    textAlign: 'right',
    truncate: true,
  },
  {
    id: 'deliveryQuantity',
    title: 'table delivery quantity',
    width: 150,
    textAlign: 'right',
    truncate: true,
  },
  {
    id: 'status',
    title: 'table status',
    width: 150,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'poCompleted',
    title: 'table po completed',
    width: 100,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'crd',
    title: 'table crd',
    width: 100,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'bondingStatus',
    title: 'table bonding status',
    width: 150,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'fgtStatus',
    title: 'table fgt status',
    width: 150,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'a01Status',
    title: 'table a01 status',
    width: 150,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'cmaStatus',
    title: 'table cma status',
    width: 150,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'fiPoStatus',
    title: 'table fi po status',
    width: 150,
    textAlign: 'left',
    truncate: true,
  },
  {
    id: 'remark',
    title: 'table remark',
    width: 150,
    textAlign: 'left',
    truncate: false,
  },
];

function Table({
  data = [],
  isLoading,
  onEventHidden = () => undefined,
  onEventPosition = () => undefined,
  onEventReadA01 = () => undefined,
  updateSeID = null,
}) {
  const t = useTranslations('dashboard.report');

  const locale = useLocale();

  const containerRef = React.useRef(null);
  const [height, setHeight] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const [columnHeight, setColumnHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  useEffect(() => {
    let resizeContainer = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight);
        setRowHeight(
          containerRef.current.querySelector('tbody tr.row-data')
            ?.clientHeight || 0
        );
        setColumnHeight(
          containerRef.current.querySelector('thead')?.clientHeight || 0
        );
      }
    };

    window.addEventListener('resize', resizeContainer);
    resizeContainer();

    return () => {
      window.removeEventListener('resize', resizeContainer);
    };
  }, [containerRef.current, data]);

  const memory = useMemo(() => {
    let mem = {
      height: 0,
      rowHeight: 0,
      columnHeight: 0,
      visibleRowCount: 0,
      index: 0,
      firstSpace: 0,
      lastSpace: 1,
      firstHeight: 0,
      lastHeight: 0,
    };

    if (rowHeight === 0 || columnHeight === 0 || data.length === 0) {
      return mem;
    }

    mem.height = height;
    mem.rowHeight = rowHeight;
    mem.columnHeight = columnHeight;
    mem.visibleRowCount = Math.ceil((height - columnHeight) / rowHeight) + 1;
    mem.index = Math.floor(scrollTop / rowHeight);

    mem.firstSpace = Math.max(mem.index - MAX_SPACE_ROWS, 0);
    mem.lastSpace = Math.min(
      mem.index + mem.visibleRowCount + MAX_SPACE_ROWS,
      data.length
    );

    mem.firstHeight = mem.firstSpace * rowHeight;
    mem.lastHeight = (data.length - mem.lastSpace) * rowHeight;

    return mem;
  }, [height, rowHeight, data, scrollTop, isLoading]);

  return (
    <ScrollArea
      className='flex-1 size-full relative'
      onScroll={handleScroll}
      ref={containerRef}
    >
      {Boolean(data.length == 0 && !isLoading) && (
        <div className='absolute inset-0 flex flex-col'>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <div>{t('table empty')}</div>
          </div>
        </div>
      )}
      <TooltipProvider>
        <table className='min-w-full table-fixed'>
          <thead className='sticky top-0 z-10 bg-[#f8f9fa]'>
            <tr className='whitespace-nowrap font-semibold'>
              {tableColumnConfig.map((column) => (
                <td
                  key={column.id}
                  className={`px-3 py-2 text-sm text-gray-600 [box-shadow:_0px_-1px_0px_0px_#e7eaf3_inset] w-[${
                    column.width
                  }px] ${column.textAlign === 'right' ? 'text-right' : ''} ${column.className}`}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-[${column.width - 24}px] ${
                          column.truncate ? 'truncate' : ''
                        }`}
                      >
                        {column.title === '#' ? column.title : t(column.title)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {column.title === '#' ? column.title : t(column.title)}
                    </TooltipContent>
                  </Tooltip>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: Number(memory.firstHeight || 0) }}></tr>
            {isLoading &&
              Array.from({ length: 10 }).map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`whitespace-nowrap h-[58px] border-t border-solid font-medium text-xs transition-colors ${
                      index === 0 ? 'border-transparent' : 'border-[#e7eaf3]'
                    }`}
                  >
                    <td className='px-3 py-3 w-[70px]'>
                      <div className='w-[46px]'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[140px]'>
                      <div className='flex flex-col w-[116px] gap-1'>
                        <div className='font-black truncate'>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse w-9/12'></div>
                        </div>
                        <div>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse'></div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[140px]'>
                      <div className='flex flex-col w-[116px] gap-1'>
                        <div className='font-black truncate'>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse w-9/12'></div>
                        </div>
                        <div>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse'></div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[180px] overflow-hidden'>
                      <div className='flex flex-col w-[156px] overflow-hidden gap-1'>
                        <div className='font-black truncate'>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse'></div>
                        </div>
                        <div className='h-3.5 rounded bg-gray-200 animate-pulse w-3/5'></div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[140px] font-light'>
                      <div className='w-[116px] flex whitespace-normal gap-1 items-center'>
                        <div>
                          <div className='size-[26px] rounded-full animate-pulse bg-gray-200'></div>
                        </div>
                        <div className='flex-1 line-clamp-2'>
                          <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[120px] text-right font-light'>
                      <div className='w-[96px] flex flex-col items-end'>
                        <div className='h-6 rounded bg-gray-200 animate-pulse w-1/3'></div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[150px] text-right'>
                      <div className='w-[126px] flex flex-col gap-0.5'>
                        <div className='flex justify-between'>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse w-1/6'></div>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse w-1/6'></div>
                        </div>
                        <div className='flex justify-end'>
                          <div className='h-1 bg-gray-200 w-full animate-pulse'></div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[150px] text-right'>
                      <div className='w-[126px] flex flex-col gap-0.5'>
                        <div className='flex justify-between'>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse w-1/6'></div>
                          <div className='h-3.5 rounded bg-gray-200 animate-pulse w-1/6'></div>
                        </div>
                        <div className='flex justify-end'>
                          <div className='h-1 bg-gray-200 w-full animate-pulse'></div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[150px]'>
                      <div className='w-[126px] flex'>
                        <div
                          className={`flex items-center gap-2 px-1.5 py-0.5 bg-gray-200 animate-pulse h-5 w-1/2`}
                        ></div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[100px]'>
                      <div className='w-[76px]'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[100px]'>
                      <div className='w-[76px]'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='h-4 rounded bg-gray-200 animate-pulse'></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            {data
              .slice(memory.firstSpace, memory.lastSpace || 1)
              .map((item, index) => {
                const indexNumber = Number.isNaN(memory.firstSpace)
                  ? 0
                  : memory.firstSpace + index;
                const inboundPercent = (
                  (item.WH_QTY / (item.SE_QTY == 0 ? item.QTY : item.SE_QTY)) *
                  100
                ).toFixed(0);
                const deliveredPercent = (
                  (item.DELIVERY_QTY /
                    (item.SE_QTY == 0 ? item.QTY : item.SE_QTY)) *
                  100
                ).toFixed(0);
                const isDifferent = item.SE_QTY !== item.QTY;
                const poCompletedTime = item.COMPLETED_TIME ?? ' ';
                const timePOCompleted = poCompletedTime.split(' ')[1];
                const datePOCompleted = poCompletedTime.split(' ')[0];
                const isShowFIFOStatus = inboundPercent >= 90;

                const getStatus = () => {
                  if (!item.SE_QTY || item.SE_QTY === 0)
                    return STATUS.CANCELLED;
                  if (item.DELIVERY_QTY >= item.SE_QTY)
                    return STATUS.DELIVERED;
                  if (new Date(item.CRD) < new Date()) return STATUS.EXPIRED;
                  if (item.WH_QTY < item.SE_QTY) return STATUS.IN_PROGRESS;
                  if (item.DELIVERY_QTY > 0 && item.DELIVERY_QTY < item.SE_QTY)
                    return STATUS.DELIVERING;
                  if (item.WH_QTY === item.SE_QTY)
                    return STATUS.WAITING_DELIVERY;
                  return STATUS.CANCELLED;
                };
                const status = t(`status ${getStatus()}`);

                const statusColorMap = {
                  [STATUS.CANCELLED]: 'bg-gray-100',
                  [STATUS.DELIVERED]: 'bg-lime-100',
                  [STATUS.EXPIRED]: 'bg-red-100',
                  [STATUS.IN_PROGRESS]: 'bg-orange-100',
                  [STATUS.DELIVERING]: 'bg-yellow-100',
                  [STATUS.WAITING_DELIVERY]: 'bg-sky-100',
                };
                const statusColor =
                  statusColorMap[getStatus()] || 'bg-gray-100';

                return (
                  <tr
                    key={indexNumber}
                    className={`${
                      isLoading ? 'invisible' : ''
                    } h-[58px] row-data whitespace-nowrap border-t border-solid font-medium text-xs hover:bg-gray-100 [&:hover>td:nth-child(3)]:!from-gray-100 [&:hover>td:nth-child(3)]:!via-gray-100 [&>td:nth-child(3)]:transition-colors transition-colors relative ${
                      indexNumber === 0
                        ? 'border-transparent'
                        : 'border-[#e7eaf3]'
                    }`}
                  >
                    <td className='px-3 py-3 w-[70px]'>
                      <div className='w-[46px]'>{indexNumber + 1}</div>
                    </td>
                    <td className='px-3 py-3 w-[140px]'>
                      <div className='flex flex-col w-[116px]'>
                        <div className='flex flex-col'>
                          <div className='flex'>
                            {updateSeID === item.SE_ID ? (
                              <div className='h-4 rounded bg-gray-200 animate-pulse w-2/3'></div>
                            ) : (
                              <Suspense
                                fallback={
                                  <div className='h-4 rounded bg-gray-200 animate-pulse w-2/3'></div>
                                }
                              >
                                <LocationItem
                                  total={item.LOCATION_TOTAL}
                                  data={{ se_id: item.SE_ID }}
                                />
                              </Suspense>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[140px] sticky left-0 bg-gradient-to-r from-white via-white to-transparent'>
                      <div className='flex flex-col w-[116px]'>
                        <div className='font-black truncate'>{item.SE_ID}</div>
                        <div>{item.MER_PO}</div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[180px] overflow-hidden'>
                      <div className='flex flex-col w-[156px] overflow-hidden'>
                        <div
                          className='font-black truncate'
                          title={item.ART_NAME}
                        >
                          {item.ART_NAME}
                        </div>
                        <div className='flex'>
                          <div className='px-1 py-[1px] bg-gray-200 text-[11px] rounded font-semibold tracking-wide'>
                            {item.PROD_NO}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[140px] font-light'>
                      <div className='w-[116px] flex whitespace-normal gap-1 items-center'>
                        <div>
                          <Image
                            src={
                              '/images/flags/' + item.DESCOUNTRY_CODE + '.png'
                            }
                            width={26}
                            height={26}
                            alt={item.DESCOUNTRY_CODE ?? 'None'}
                          />
                        </div>
                        <div className='flex-1 line-clamp-2'>
                          {countries.getName(item.DESCOUNTRY_CODE, locale) ||
                            t('table unknown country')}
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[120px] text-right font-light'>
                      <div className='w-[96px] flex flex-col'>
                        {isDifferent ? (
                          <Fragment>
                            <div className='text-base leading-4'>
                              {item.SE_QTY}
                            </div>
                            <div className='line-through text-red-400'>
                              {item.QTY}
                            </div>
                          </Fragment>
                        ) : (
                          <div className='text-xl'>{item.SE_QTY}</div>
                        )}
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[150px] text-right'>
                      <div className='w-[126px] flex flex-col gap-0.5'>
                        <div className='flex justify-between'>
                          <span className='text-gray-400 font-light'>
                            ({inboundPercent}%)
                          </span>
                          <span className='font-light'>{item.WH_QTY}</span>
                        </div>
                        <div className='flex justify-end'>
                          <div className='h-1 border border-solid border-gray-200 w-full'>
                            <div
                              className={`${percentageColor(
                                inboundPercent
                              )} h-1 max-w-full`}
                              style={{ width: `${inboundPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[150px] text-right'>
                      <div className='w-[126px] flex flex-col gap-0.5'>
                        <div className='flex justify-between'>
                          <span className='text-gray-400 font-light'>
                            ({deliveredPercent}%)
                          </span>
                          <span className='font-light'>
                            {item.DELIVERY_QTY ?? 0}
                          </span>
                        </div>
                        <div className='flex justify-end'>
                          <div className='h-1 border border-solid border-gray-200 w-full'>
                            <div
                              className={`${percentageColor(
                                deliveredPercent
                              )} h-1 max-w-full`}
                              style={{ width: `${deliveredPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[150px]'>
                      <div className='w-[126px] flex'>
                        <div
                          className={`flex items-center gap-2 text-xs px-1.5 py-0.5 bg-gray-200 font-medium ${statusColor} text-gray-600`}
                        >
                          {status}
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[100px]'>
                      <div className='w-[76px] flex flex-col'>
                        {inboundPercent >= 100 ? (
                          <Fragment>
                            <div className='font-black text-gray-600'>
                              {datePOCompleted}
                            </div>
                            <div className='text-[10px]'>{timePOCompleted}</div>
                          </Fragment>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </td>
                    <td className='px-3 py-3 w-[100px]'>
                      <div className='w-[76px]'>{item.CRD}</div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`block size-2.5 rounded-full ${
                              item.BONDING_RESULT == 'FAIL'
                                ? 'bg-red-500'
                                : item.BONDING_RESULT == 'PASS'
                                ? 'bg-lime-500'
                                : 'bg-gray-400/90'
                            }`}
                          ></span>
                          <div
                            className={`font-black ${
                              item.BONDING_RESULT == 'FAIL'
                                ? 'text-red-600 uppercase'
                                : item.BONDING_RESULT == 'PASS'
                                ? 'text-lime-600 uppercase'
                                : 'text-gray-400 '
                            }`}
                          >
                            {item.BONDING_RESULT
                              ? t(`table ${item.BONDING_RESULT}`)
                              : t('table no result')}
                          </div>
                        </div>
                        {Boolean(item.BONDING_RESULT) && (
                          <div>{item.BONDING_DATE}</div>
                        )}
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`block size-2.5 rounded-full ${
                              item.FGT_RESULT == 'FAIL'
                                ? 'bg-red-500'
                                : item.FGT_RESULT == 'PASS'
                                ? 'bg-lime-500'
                                : 'bg-gray-400/90'
                            }`}
                          ></span>
                          <div
                            className={`font-black ${
                              item.FGT_RESULT == 'FAIL'
                                ? 'text-red-600 uppercase'
                                : item.FGT_RESULT == 'PASS'
                                ? 'text-lime-600 uppercase'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.FGT_RESULT
                              ? t(`table ${item.FGT_RESULT}`)
                              : t('table no result')}
                          </div>
                        </div>
                        {Boolean(item.FGT_RESULT) && <div>{item.FGT_DATE}</div>}
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        {item.A01_FILE ? (
                          <Fragment>
                            <div className='flex'>
                              <div
                                className='flex items-center gap-2 hover:bg-sky-500 hover:text-white hover:ring hover:ring-sky-500 cursor-pointer rounded-xs text-orange-500'
                                onClick={() => onEventReadA01(item)}
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={4}
                                  stroke='currentColor'
                                  className='size-3'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
                                  />
                                </svg>

                                <div
                                  className={`font-black uppercase pt-0.5 leading-3`}
                                >
                                  {t('table view')}
                                </div>
                              </div>
                            </div>
                            <div>{item.A01_DATE}</div>
                          </Fragment>
                        ) : (
                          <div className='flex items-center gap-2'>
                            <span
                              className={`block size-2.5 rounded-full bg-gray-400/90`}
                            ></span>
                            <div className={`font-black text-gray-400`}>
                              {t('table no result')}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`block size-2.5 rounded-full ${
                              item.CMA_RESULT == '1'
                                ? 'bg-red-500'
                                : item.CMA_RESULT == '0'
                                ? 'bg-lime-500'
                                : 'bg-gray-400/90'
                            }`}
                          ></span>
                          <div
                            className={`font-black ${
                              item.CMA_RESULT == '1'
                                ? 'text-red-600 uppercase'
                                : item.CMA_RESULT == '0'
                                ? 'text-lime-600 uppercase'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.CMA_RESULT === '1'
                              ? t(`table FAIL`)
                              : item.CMA_RESULT === '0'
                              ? t(`table PASS`)
                              : t('table no result')}
                          </div>
                        </div>
                        {Boolean(item.CMA_RESULT) && <div>{item.CMA_DATE}</div>}
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`block size-2.5 rounded-full ${
                              !isShowFIFOStatus ||
                              !['0', '1'].includes(item.FI_RESULT)
                                ? 'bg-gray-400/90'
                                : item.FI_RESULT == '0'
                                ? 'bg-red-500'
                                : item.FI_RESULT == '1'
                                ? 'bg-lime-500'
                                : ''
                            }`}
                          ></span>
                          <div
                            className={`font-black ${
                              !isShowFIFOStatus ||
                              !['0', '1'].includes(item.FI_RESULT)
                                ? 'text-gray-400'
                                : item.FI_RESULT == '0'
                                ? 'text-red-600 uppercase'
                                : item.FI_RESULT == '1'
                                ? 'text-lime-600 uppercase'
                                : ''
                            }`}
                          >
                            {!isShowFIFOStatus ||
                            !['0', '1'].includes(item.FI_RESULT)
                              ? t('table no result')
                              : item.FI_RESULT === '0'
                              ? t(`table FAIL`)
                              : item.FI_RESULT === '1'
                              ? t(`table PASS`)
                              : ''}
                          </div>
                        </div>
                        {Boolean(item.FI_RESULT && isShowFIFOStatus) && <div>{item.FI_DATE}</div>}
                      </div>
                    </td>
                    <td className='w-[150px] px-3 py-3'>
                      <div className='w-[126px] flex flex-col'>
                        <div className='flex items-center gap-2'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={2}
                            stroke='currentColor'
                            className='size-5 text-gray-400'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
                            />
                          </svg>
                          <div className={`font-bold text-gray-400`}>
                            {t('table no comment')}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            <tr style={{ height: Number(memory.lastHeight || 0) }}></tr>
          </tbody>
        </table>
      </TooltipProvider>
      <ScrollBar orientation={'horizontal'} />
      <ScrollBar orientation={'vertical'} />
    </ScrollArea>
  );
}

export default Table;
