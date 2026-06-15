import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import ReportSettingModel from "../../models/report-setting.models";
import { UserDocument } from "../../models/user.models";
import mongoose from "mongoose";
import { generateReportService } from "../../services/report.services";

export const processReportJob = async() => {
  const now = new Date();
  //july 1, june 1- jun 30
  const from = startOfMonth(subMonths(now,1))
  const to = endOfMonth(subMonths(now,1))


  try {
    const reportSettingCursor = ReportSettingModel.find({
      isEnabled: true,
      nextReportDate: {$lte: now},
    }).populate<{userId: UserDocument}>("userId").cursor();

    console.log("Running report")


    for await(const setting of reportSettingCursor){
      const user = setting.userId as UserDocument;
      if(!user){
        console.log("User not found for setting: ", setting._id);
        continue;
      }

      const session = await mongoose.startSession();

      try{
        const report = await generateReportService(user.id, from, to);

        let emailSent = false;
        if(report){
          try {
            // Send Email
            emailSent = true;
          }catch(error){
            console.log(`Email failed for ${user.id}`);
          }
        }

        await session.withTransaction(async() => {
          const bulkReports: any[] = []
          const bulkSetting: any[] = []
        })

      }catch(error){

      }
    }

  }catch(error){

  }
}