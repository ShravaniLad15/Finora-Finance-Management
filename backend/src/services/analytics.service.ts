import mongoose from "mongoose";
import { DateRangeEnum, DateRangePreset } from "../enums/date-range.enum";
import { getDateRange } from "../utils/date";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.models";
import { differenceInDays, subDays, subYears } from "date-fns";

export const summaryAnalyticsService = async(
  userId: string,
  dateRangePreset?: DateRangePreset,
  customFrom?: Date,
  customTo?: Date, 
) => {
  const range = getDateRange(dateRangePreset, customFrom, customTo);

  const { from, to, value: rangeValue} = range;

  const currentPeriodPipeline: any[] = [
    {
      $match:{
        userId: new mongoose.Types.ObjectId(userId),
        ...(from && to && {
          date: {
            $gte: from,
            $lte: to,
          },
        }),
      },
    },{
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [
              {$eq: ["$type", TransactionTypeEnum.INCOME]},
              {$abs: "$amount"},
                0,
            ],
          }
        },
        totalExpenses: {
          $sum: {
            $cond: [
              {$eq: ["$type", TransactionTypeEnum.EXPENSE]},
              {$abs: "$amount"},
                0,
            ],
          }
        },

        transactionCount: { $sum: 1 },
      }
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpenses: 1,
        transactionCount: 1,

        availableBalance: {$subtract: ["$totalIncome", "$totalExpenses"]},

        savingData: {
          $let: {
            vars: {
              income: {$ifNull: ["$totalIncome", 0]},
              expenses: {$ifNull: ["$totalExpenses", 0]},
            },
            in: {
              //((totalIncome - totalExpenses) / totalIncome) * 100;
              savingsPercentage: {
                $cond:[
                  {$lte: ["$$income",0]}, 0,
                  {
                    $multiply: [{
                        $divide: [
                          {$subtract: ["$$income", "$$expenses"]},"$$income"
                        ]
                      },
                      100
                    ]
                  }
                ]
              },
              //Expense Ratio = (expenses / income) * 100
              expenseRatio: {
                $cond: [
                  {$lte: ["$$income",0]}, 0,
                  {
                    $multiply: [{
                      $divide: ["$$expenses", "$$income"]
                    },100]
                  }
                ]
              }
            }
          }
        }
      }
    }

  ]

  const [current] = await TransactionModel.aggregate(currentPeriodPipeline);

  const {
    totalIncome = 0,
    totalExpenses = 0,
    availableBalance = 0,
    transactionCount = 0,
    savingsData = {
      expenseRatio : 0,
      savingsPercentage: 0,
    },
  } = current || {};

  let percentageChange: any = {
    income: 0,
    expenses: 0,
    balance: 0,
    prevPeriodFrom: null,
    prevPeriodTo: null,
    previousValues: {}
  };

  if(from && to && rangeValue !== DateRangeEnum.ALL_TIME){
    //last 30 days previous last 30 days    
    const period = differenceInDays(to, from) + 1;
    const isYearly = [
      DateRangeEnum.LAST_YEAR,
      DateRangeEnum.THIS_YEAR,
    ].includes(rangeValue);

    const prevPeriodFrom = isYearly ? subYears(from, 1)

  }

};