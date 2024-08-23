<?php
namespace App\Mailer ;

use Mailjet\Client;
use Mailjet\Resources;

class MailerMahm 
{
    private $api_key="a1c2210863378ac5ba0a02197345aa69";
    private $api_key_secret="1bf444045653711c567da4ac059c1ced";
    public function send ($to_mail,$name,$subject,$content): ?bool
    {
        $mj= new Client($this->api_key,$this->api_key_secret,true,['version' => 'v3.1']);
$body = [
    'Messages' => [
        [
            'From' => [
                'Email' => "platcomdovah@gmail.com",
                'Name' => "Ragnar Lelouche"
            ],
            'To' => [
                [
                    'Email' =>$to_mail,
                    'Name' => $name
                ]
            ],
            'TemplateID' =>5403478,
            'TemplateLanguage' => true,
            'Subject' => $subject,
            'Variables' => [
                'content' => $content,
                'subject' =>$subject,
               
            ]
        ]
    ]
];
$response = $mj->post(Resources::$Email, ['body' => $body]);
 return $response->success() ;
    }
}
