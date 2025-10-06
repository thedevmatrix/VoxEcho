import { UseInterceptors, Controller, Post,  UploadedFile, ParseFilePipeBuilder, HttpStatus, Body, Req, BadRequestException} from "@nestjs/common";
import type { Express } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { createIncidentDto } from "../dto/incidentDto/incidentPost.dto";
import { IncidentsService } from "./incidents.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/AuthJwt.strategy";
import { diskStorage } from "multer";
import { extname } from "path";




@Controller('incident')
export class IncidentsController {

    constructor (private readonly incidentsService : IncidentsService,
    ){}
    @Post("upload")
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', {

        //--> Reminder  <--//
        //This method should be modified to work with the multer configuration module.
        storage: diskStorage({
        destination: './upload',

        filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueName + extname(file.originalname))
          }

        })

        
    }))

    //used special parse in builder class for file validation
    async uploadFileAndValidate(@UploadedFile(
        new ParseFilePipeBuilder()
       .addFileTypeValidator({ 
         fileType: /(jpeg|jpg|png|webp)$/,

         //------caution 
         skipMagicNumbersValidation: true
        

 })
     .addMaxSizeValidator({
            maxSize: 100000000
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    
    ) file: Express.Multer.File,
     @Body() dto: createIncidentDto, 
     @Req() req: any){
        
        
       const userId = req.user.id;
       return  await this.incidentsService.handleIncidentUpload(dto , file, userId)


    }
}
