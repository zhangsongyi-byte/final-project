import _ from 'lodash';
/*
   customError
*/
export default function CustomError (err){

   console.log('err===>',err);

   this.details = _.get(err, 'response.data.details');

   this.code = _.get(err, 'response.data.code');

   this.message = _.get(err, 'response.data.message') || err.message;

   // request 看有没有timeout
   if (/timeout of/.test(err.message)) {
      this.code = 'timeout';
   }

   // 没有网络时候提示 network
   if (/Network Error/.test(err.message)) {
      this.code = 'network';
   }

   // 翻译里面的error
   //    const translation = i18n.t(`error.${this.code}`);

   //    console.log('translation ===>', translation);
   //    if (translation) {
   //       this.message = i18n.t(`error.${this.code}`,{ ...this.details });
   //    }else{
   //       // 没有翻译时候的错误信息
   //       this.message = _.get(err, 'response.data.message') || err.message || i18n.t('error.unknown');
   //    }

   //    console.log('customError this',this);

}