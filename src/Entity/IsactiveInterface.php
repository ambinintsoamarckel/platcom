<?php
namespace App\Entity;

interface IsactiveInterface
{
    public function isIsactive(): ?bool;

    public function setIsactive(bool $isactive): static;
}
?>